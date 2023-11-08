import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBilan, NewBilan } from '../bilan.model';

export type PartialUpdateBilan = Partial<IBilan> & Pick<IBilan, 'id'>;

type RestOf<T extends IBilan | NewBilan> = Omit<T, 'exercice'> & {
  exercice?: string | null;
};

export type RestBilan = RestOf<IBilan>;

export type NewRestBilan = RestOf<NewBilan>;

export type PartialUpdateRestBilan = RestOf<PartialUpdateBilan>;

export type EntityResponseType = HttpResponse<IBilan>;
export type EntityArrayResponseType = HttpResponse<IBilan[]>;

@Injectable({ providedIn: 'root' })
export class BilanService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bilans');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(bilan: NewBilan): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bilan);
    return this.http.post<RestBilan>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(bilan: IBilan): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bilan);
    return this.http
      .put<RestBilan>(`${this.resourceUrl}/${this.getBilanIdentifier(bilan)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(bilan: PartialUpdateBilan): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bilan);
    return this.http
      .patch<RestBilan>(`${this.resourceUrl}/${this.getBilanIdentifier(bilan)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestBilan>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestBilan[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBilanIdentifier(bilan: Pick<IBilan, 'id'>): number {
    return bilan.id;
  }

  compareBilan(o1: Pick<IBilan, 'id'> | null, o2: Pick<IBilan, 'id'> | null): boolean {
    return o1 && o2 ? this.getBilanIdentifier(o1) === this.getBilanIdentifier(o2) : o1 === o2;
  }

  addBilanToCollectionIfMissing<Type extends Pick<IBilan, 'id'>>(
    bilanCollection: Type[],
    ...bilansToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bilans: Type[] = bilansToCheck.filter(isPresent);
    if (bilans.length > 0) {
      const bilanCollectionIdentifiers = bilanCollection.map(bilanItem => this.getBilanIdentifier(bilanItem)!);
      const bilansToAdd = bilans.filter(bilanItem => {
        const bilanIdentifier = this.getBilanIdentifier(bilanItem);
        if (bilanCollectionIdentifiers.includes(bilanIdentifier)) {
          return false;
        }
        bilanCollectionIdentifiers.push(bilanIdentifier);
        return true;
      });
      return [...bilansToAdd, ...bilanCollection];
    }
    return bilanCollection;
  }

  protected convertDateFromClient<T extends IBilan | NewBilan | PartialUpdateBilan>(bilan: T): RestOf<T> {
    return {
      ...bilan,
      exercice: bilan.exercice?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restBilan: RestBilan): IBilan {
    return {
      ...restBilan,
      exercice: restBilan.exercice ? dayjs(restBilan.exercice) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestBilan>): HttpResponse<IBilan> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestBilan[]>): HttpResponse<IBilan[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
