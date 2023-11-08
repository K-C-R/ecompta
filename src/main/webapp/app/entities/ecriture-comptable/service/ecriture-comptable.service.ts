import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEcritureComptable, NewEcritureComptable } from '../ecriture-comptable.model';

export type PartialUpdateEcritureComptable = Partial<IEcritureComptable> & Pick<IEcritureComptable, 'id'>;

type RestOf<T extends IEcritureComptable | NewEcritureComptable> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestEcritureComptable = RestOf<IEcritureComptable>;

export type NewRestEcritureComptable = RestOf<NewEcritureComptable>;

export type PartialUpdateRestEcritureComptable = RestOf<PartialUpdateEcritureComptable>;

export type EntityResponseType = HttpResponse<IEcritureComptable>;
export type EntityArrayResponseType = HttpResponse<IEcritureComptable[]>;

@Injectable({ providedIn: 'root' })
export class EcritureComptableService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ecriture-comptables');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(ecritureComptable: NewEcritureComptable): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ecritureComptable);
    return this.http
      .post<RestEcritureComptable>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(ecritureComptable: IEcritureComptable): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ecritureComptable);
    return this.http
      .put<RestEcritureComptable>(`${this.resourceUrl}/${this.getEcritureComptableIdentifier(ecritureComptable)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(ecritureComptable: PartialUpdateEcritureComptable): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ecritureComptable);
    return this.http
      .patch<RestEcritureComptable>(`${this.resourceUrl}/${this.getEcritureComptableIdentifier(ecritureComptable)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEcritureComptable>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEcritureComptable[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEcritureComptableIdentifier(ecritureComptable: Pick<IEcritureComptable, 'id'>): number {
    return ecritureComptable.id;
  }

  compareEcritureComptable(o1: Pick<IEcritureComptable, 'id'> | null, o2: Pick<IEcritureComptable, 'id'> | null): boolean {
    return o1 && o2 ? this.getEcritureComptableIdentifier(o1) === this.getEcritureComptableIdentifier(o2) : o1 === o2;
  }

  addEcritureComptableToCollectionIfMissing<Type extends Pick<IEcritureComptable, 'id'>>(
    ecritureComptableCollection: Type[],
    ...ecritureComptablesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ecritureComptables: Type[] = ecritureComptablesToCheck.filter(isPresent);
    if (ecritureComptables.length > 0) {
      const ecritureComptableCollectionIdentifiers = ecritureComptableCollection.map(
        ecritureComptableItem => this.getEcritureComptableIdentifier(ecritureComptableItem)!,
      );
      const ecritureComptablesToAdd = ecritureComptables.filter(ecritureComptableItem => {
        const ecritureComptableIdentifier = this.getEcritureComptableIdentifier(ecritureComptableItem);
        if (ecritureComptableCollectionIdentifiers.includes(ecritureComptableIdentifier)) {
          return false;
        }
        ecritureComptableCollectionIdentifiers.push(ecritureComptableIdentifier);
        return true;
      });
      return [...ecritureComptablesToAdd, ...ecritureComptableCollection];
    }
    return ecritureComptableCollection;
  }

  protected convertDateFromClient<T extends IEcritureComptable | NewEcritureComptable | PartialUpdateEcritureComptable>(
    ecritureComptable: T,
  ): RestOf<T> {
    return {
      ...ecritureComptable,
      date: ecritureComptable.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEcritureComptable: RestEcritureComptable): IEcritureComptable {
    return {
      ...restEcritureComptable,
      date: restEcritureComptable.date ? dayjs(restEcritureComptable.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEcritureComptable>): HttpResponse<IEcritureComptable> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEcritureComptable[]>): HttpResponse<IEcritureComptable[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
