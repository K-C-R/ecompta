import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJournalDefinitif, NewJournalDefinitif } from '../journal-definitif.model';

export type PartialUpdateJournalDefinitif = Partial<IJournalDefinitif> & Pick<IJournalDefinitif, 'id'>;

type RestOf<T extends IJournalDefinitif | NewJournalDefinitif> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestJournalDefinitif = RestOf<IJournalDefinitif>;

export type NewRestJournalDefinitif = RestOf<NewJournalDefinitif>;

export type PartialUpdateRestJournalDefinitif = RestOf<PartialUpdateJournalDefinitif>;

export type EntityResponseType = HttpResponse<IJournalDefinitif>;
export type EntityArrayResponseType = HttpResponse<IJournalDefinitif[]>;

@Injectable({ providedIn: 'root' })
export class JournalDefinitifService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/journal-definitifs');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(journalDefinitif: NewJournalDefinitif): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(journalDefinitif);
    return this.http
      .post<RestJournalDefinitif>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(journalDefinitif: IJournalDefinitif): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(journalDefinitif);
    return this.http
      .put<RestJournalDefinitif>(`${this.resourceUrl}/${this.getJournalDefinitifIdentifier(journalDefinitif)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(journalDefinitif: PartialUpdateJournalDefinitif): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(journalDefinitif);
    return this.http
      .patch<RestJournalDefinitif>(`${this.resourceUrl}/${this.getJournalDefinitifIdentifier(journalDefinitif)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestJournalDefinitif>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestJournalDefinitif[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getJournalDefinitifIdentifier(journalDefinitif: Pick<IJournalDefinitif, 'id'>): number {
    return journalDefinitif.id;
  }

  compareJournalDefinitif(o1: Pick<IJournalDefinitif, 'id'> | null, o2: Pick<IJournalDefinitif, 'id'> | null): boolean {
    return o1 && o2 ? this.getJournalDefinitifIdentifier(o1) === this.getJournalDefinitifIdentifier(o2) : o1 === o2;
  }

  addJournalDefinitifToCollectionIfMissing<Type extends Pick<IJournalDefinitif, 'id'>>(
    journalDefinitifCollection: Type[],
    ...journalDefinitifsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const journalDefinitifs: Type[] = journalDefinitifsToCheck.filter(isPresent);
    if (journalDefinitifs.length > 0) {
      const journalDefinitifCollectionIdentifiers = journalDefinitifCollection.map(
        journalDefinitifItem => this.getJournalDefinitifIdentifier(journalDefinitifItem)!,
      );
      const journalDefinitifsToAdd = journalDefinitifs.filter(journalDefinitifItem => {
        const journalDefinitifIdentifier = this.getJournalDefinitifIdentifier(journalDefinitifItem);
        if (journalDefinitifCollectionIdentifiers.includes(journalDefinitifIdentifier)) {
          return false;
        }
        journalDefinitifCollectionIdentifiers.push(journalDefinitifIdentifier);
        return true;
      });
      return [...journalDefinitifsToAdd, ...journalDefinitifCollection];
    }
    return journalDefinitifCollection;
  }

  protected convertDateFromClient<T extends IJournalDefinitif | NewJournalDefinitif | PartialUpdateJournalDefinitif>(
    journalDefinitif: T,
  ): RestOf<T> {
    return {
      ...journalDefinitif,
      date: journalDefinitif.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restJournalDefinitif: RestJournalDefinitif): IJournalDefinitif {
    return {
      ...restJournalDefinitif,
      date: restJournalDefinitif.date ? dayjs(restJournalDefinitif.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestJournalDefinitif>): HttpResponse<IJournalDefinitif> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestJournalDefinitif[]>): HttpResponse<IJournalDefinitif[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
