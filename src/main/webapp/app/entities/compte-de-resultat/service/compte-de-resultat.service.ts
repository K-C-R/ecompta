import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICompteDeResultat, NewCompteDeResultat } from '../compte-de-resultat.model';

export type PartialUpdateCompteDeResultat = Partial<ICompteDeResultat> & Pick<ICompteDeResultat, 'id'>;

type RestOf<T extends ICompteDeResultat | NewCompteDeResultat> = Omit<T, 'exercice'> & {
  exercice?: string | null;
};

export type RestCompteDeResultat = RestOf<ICompteDeResultat>;

export type NewRestCompteDeResultat = RestOf<NewCompteDeResultat>;

export type PartialUpdateRestCompteDeResultat = RestOf<PartialUpdateCompteDeResultat>;

export type EntityResponseType = HttpResponse<ICompteDeResultat>;
export type EntityArrayResponseType = HttpResponse<ICompteDeResultat[]>;

@Injectable({ providedIn: 'root' })
export class CompteDeResultatService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/compte-de-resultats');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(compteDeResultat: NewCompteDeResultat): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(compteDeResultat);
    return this.http
      .post<RestCompteDeResultat>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(compteDeResultat: ICompteDeResultat): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(compteDeResultat);
    return this.http
      .put<RestCompteDeResultat>(`${this.resourceUrl}/${this.getCompteDeResultatIdentifier(compteDeResultat)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(compteDeResultat: PartialUpdateCompteDeResultat): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(compteDeResultat);
    return this.http
      .patch<RestCompteDeResultat>(`${this.resourceUrl}/${this.getCompteDeResultatIdentifier(compteDeResultat)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCompteDeResultat>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCompteDeResultat[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCompteDeResultatIdentifier(compteDeResultat: Pick<ICompteDeResultat, 'id'>): number {
    return compteDeResultat.id;
  }

  compareCompteDeResultat(o1: Pick<ICompteDeResultat, 'id'> | null, o2: Pick<ICompteDeResultat, 'id'> | null): boolean {
    return o1 && o2 ? this.getCompteDeResultatIdentifier(o1) === this.getCompteDeResultatIdentifier(o2) : o1 === o2;
  }

  addCompteDeResultatToCollectionIfMissing<Type extends Pick<ICompteDeResultat, 'id'>>(
    compteDeResultatCollection: Type[],
    ...compteDeResultatsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const compteDeResultats: Type[] = compteDeResultatsToCheck.filter(isPresent);
    if (compteDeResultats.length > 0) {
      const compteDeResultatCollectionIdentifiers = compteDeResultatCollection.map(
        compteDeResultatItem => this.getCompteDeResultatIdentifier(compteDeResultatItem)!,
      );
      const compteDeResultatsToAdd = compteDeResultats.filter(compteDeResultatItem => {
        const compteDeResultatIdentifier = this.getCompteDeResultatIdentifier(compteDeResultatItem);
        if (compteDeResultatCollectionIdentifiers.includes(compteDeResultatIdentifier)) {
          return false;
        }
        compteDeResultatCollectionIdentifiers.push(compteDeResultatIdentifier);
        return true;
      });
      return [...compteDeResultatsToAdd, ...compteDeResultatCollection];
    }
    return compteDeResultatCollection;
  }

  protected convertDateFromClient<T extends ICompteDeResultat | NewCompteDeResultat | PartialUpdateCompteDeResultat>(
    compteDeResultat: T,
  ): RestOf<T> {
    return {
      ...compteDeResultat,
      exercice: compteDeResultat.exercice?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCompteDeResultat: RestCompteDeResultat): ICompteDeResultat {
    return {
      ...restCompteDeResultat,
      exercice: restCompteDeResultat.exercice ? dayjs(restCompteDeResultat.exercice) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCompteDeResultat>): HttpResponse<ICompteDeResultat> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCompteDeResultat[]>): HttpResponse<ICompteDeResultat[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
