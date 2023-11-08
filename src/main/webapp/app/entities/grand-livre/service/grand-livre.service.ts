import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGrandLivre, NewGrandLivre } from '../grand-livre.model';

export type PartialUpdateGrandLivre = Partial<IGrandLivre> & Pick<IGrandLivre, 'id'>;

type RestOf<T extends IGrandLivre | NewGrandLivre> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestGrandLivre = RestOf<IGrandLivre>;

export type NewRestGrandLivre = RestOf<NewGrandLivre>;

export type PartialUpdateRestGrandLivre = RestOf<PartialUpdateGrandLivre>;

export type EntityResponseType = HttpResponse<IGrandLivre>;
export type EntityArrayResponseType = HttpResponse<IGrandLivre[]>;

@Injectable({ providedIn: 'root' })
export class GrandLivreService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grand-livres');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(grandLivre: NewGrandLivre): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(grandLivre);
    return this.http
      .post<RestGrandLivre>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(grandLivre: IGrandLivre): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(grandLivre);
    return this.http
      .put<RestGrandLivre>(`${this.resourceUrl}/${this.getGrandLivreIdentifier(grandLivre)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(grandLivre: PartialUpdateGrandLivre): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(grandLivre);
    return this.http
      .patch<RestGrandLivre>(`${this.resourceUrl}/${this.getGrandLivreIdentifier(grandLivre)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestGrandLivre>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestGrandLivre[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGrandLivreIdentifier(grandLivre: Pick<IGrandLivre, 'id'>): number {
    return grandLivre.id;
  }

  compareGrandLivre(o1: Pick<IGrandLivre, 'id'> | null, o2: Pick<IGrandLivre, 'id'> | null): boolean {
    return o1 && o2 ? this.getGrandLivreIdentifier(o1) === this.getGrandLivreIdentifier(o2) : o1 === o2;
  }

  addGrandLivreToCollectionIfMissing<Type extends Pick<IGrandLivre, 'id'>>(
    grandLivreCollection: Type[],
    ...grandLivresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const grandLivres: Type[] = grandLivresToCheck.filter(isPresent);
    if (grandLivres.length > 0) {
      const grandLivreCollectionIdentifiers = grandLivreCollection.map(grandLivreItem => this.getGrandLivreIdentifier(grandLivreItem)!);
      const grandLivresToAdd = grandLivres.filter(grandLivreItem => {
        const grandLivreIdentifier = this.getGrandLivreIdentifier(grandLivreItem);
        if (grandLivreCollectionIdentifiers.includes(grandLivreIdentifier)) {
          return false;
        }
        grandLivreCollectionIdentifiers.push(grandLivreIdentifier);
        return true;
      });
      return [...grandLivresToAdd, ...grandLivreCollection];
    }
    return grandLivreCollection;
  }

  protected convertDateFromClient<T extends IGrandLivre | NewGrandLivre | PartialUpdateGrandLivre>(grandLivre: T): RestOf<T> {
    return {
      ...grandLivre,
      date: grandLivre.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restGrandLivre: RestGrandLivre): IGrandLivre {
    return {
      ...restGrandLivre,
      date: restGrandLivre.date ? dayjs(restGrandLivre.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestGrandLivre>): HttpResponse<IGrandLivre> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestGrandLivre[]>): HttpResponse<IGrandLivre[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
