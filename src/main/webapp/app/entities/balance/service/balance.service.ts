import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBalance, NewBalance } from '../balance.model';

export type PartialUpdateBalance = Partial<IBalance> & Pick<IBalance, 'id'>;

type RestOf<T extends IBalance | NewBalance> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestBalance = RestOf<IBalance>;

export type NewRestBalance = RestOf<NewBalance>;

export type PartialUpdateRestBalance = RestOf<PartialUpdateBalance>;

export type EntityResponseType = HttpResponse<IBalance>;
export type EntityArrayResponseType = HttpResponse<IBalance[]>;

@Injectable({ providedIn: 'root' })
export class BalanceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/balances');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(balance: NewBalance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(balance);
    return this.http
      .post<RestBalance>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(balance: IBalance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(balance);
    return this.http
      .put<RestBalance>(`${this.resourceUrl}/${this.getBalanceIdentifier(balance)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(balance: PartialUpdateBalance): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(balance);
    return this.http
      .patch<RestBalance>(`${this.resourceUrl}/${this.getBalanceIdentifier(balance)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestBalance>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestBalance[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBalanceIdentifier(balance: Pick<IBalance, 'id'>): number {
    return balance.id;
  }

  compareBalance(o1: Pick<IBalance, 'id'> | null, o2: Pick<IBalance, 'id'> | null): boolean {
    return o1 && o2 ? this.getBalanceIdentifier(o1) === this.getBalanceIdentifier(o2) : o1 === o2;
  }

  addBalanceToCollectionIfMissing<Type extends Pick<IBalance, 'id'>>(
    balanceCollection: Type[],
    ...balancesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const balances: Type[] = balancesToCheck.filter(isPresent);
    if (balances.length > 0) {
      const balanceCollectionIdentifiers = balanceCollection.map(balanceItem => this.getBalanceIdentifier(balanceItem)!);
      const balancesToAdd = balances.filter(balanceItem => {
        const balanceIdentifier = this.getBalanceIdentifier(balanceItem);
        if (balanceCollectionIdentifiers.includes(balanceIdentifier)) {
          return false;
        }
        balanceCollectionIdentifiers.push(balanceIdentifier);
        return true;
      });
      return [...balancesToAdd, ...balanceCollection];
    }
    return balanceCollection;
  }

  protected convertDateFromClient<T extends IBalance | NewBalance | PartialUpdateBalance>(balance: T): RestOf<T> {
    return {
      ...balance,
      date: balance.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restBalance: RestBalance): IBalance {
    return {
      ...restBalance,
      date: restBalance.date ? dayjs(restBalance.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestBalance>): HttpResponse<IBalance> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestBalance[]>): HttpResponse<IBalance[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
