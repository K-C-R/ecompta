import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IResultat, NewResultat } from '../resultat.model';

export type PartialUpdateResultat = Partial<IResultat> & Pick<IResultat, 'id'>;

type RestOf<T extends IResultat | NewResultat> = Omit<T, 'exercice'> & {
  exercice?: string | null;
};

export type RestResultat = RestOf<IResultat>;

export type NewRestResultat = RestOf<NewResultat>;

export type PartialUpdateRestResultat = RestOf<PartialUpdateResultat>;

export type EntityResponseType = HttpResponse<IResultat>;
export type EntityArrayResponseType = HttpResponse<IResultat[]>;

@Injectable({ providedIn: 'root' })
export class ResultatService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/resultats');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(resultat: NewResultat): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(resultat);
    return this.http
      .post<RestResultat>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(resultat: IResultat): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(resultat);
    return this.http
      .put<RestResultat>(`${this.resourceUrl}/${this.getResultatIdentifier(resultat)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(resultat: PartialUpdateResultat): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(resultat);
    return this.http
      .patch<RestResultat>(`${this.resourceUrl}/${this.getResultatIdentifier(resultat)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestResultat>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestResultat[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getResultatIdentifier(resultat: Pick<IResultat, 'id'>): number {
    return resultat.id;
  }

  compareResultat(o1: Pick<IResultat, 'id'> | null, o2: Pick<IResultat, 'id'> | null): boolean {
    return o1 && o2 ? this.getResultatIdentifier(o1) === this.getResultatIdentifier(o2) : o1 === o2;
  }

  addResultatToCollectionIfMissing<Type extends Pick<IResultat, 'id'>>(
    resultatCollection: Type[],
    ...resultatsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const resultats: Type[] = resultatsToCheck.filter(isPresent);
    if (resultats.length > 0) {
      const resultatCollectionIdentifiers = resultatCollection.map(resultatItem => this.getResultatIdentifier(resultatItem)!);
      const resultatsToAdd = resultats.filter(resultatItem => {
        const resultatIdentifier = this.getResultatIdentifier(resultatItem);
        if (resultatCollectionIdentifiers.includes(resultatIdentifier)) {
          return false;
        }
        resultatCollectionIdentifiers.push(resultatIdentifier);
        return true;
      });
      return [...resultatsToAdd, ...resultatCollection];
    }
    return resultatCollection;
  }

  protected convertDateFromClient<T extends IResultat | NewResultat | PartialUpdateResultat>(resultat: T): RestOf<T> {
    return {
      ...resultat,
      exercice: resultat.exercice?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restResultat: RestResultat): IResultat {
    return {
      ...restResultat,
      exercice: restResultat.exercice ? dayjs(restResultat.exercice) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestResultat>): HttpResponse<IResultat> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestResultat[]>): HttpResponse<IResultat[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
