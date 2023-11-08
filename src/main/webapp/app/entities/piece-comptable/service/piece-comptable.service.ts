import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPieceComptable, NewPieceComptable } from '../piece-comptable.model';

export type PartialUpdatePieceComptable = Partial<IPieceComptable> & Pick<IPieceComptable, 'id'>;

type RestOf<T extends IPieceComptable | NewPieceComptable> = Omit<T, 'datePiece'> & {
  datePiece?: string | null;
};

export type RestPieceComptable = RestOf<IPieceComptable>;

export type NewRestPieceComptable = RestOf<NewPieceComptable>;

export type PartialUpdateRestPieceComptable = RestOf<PartialUpdatePieceComptable>;

export type EntityResponseType = HttpResponse<IPieceComptable>;
export type EntityArrayResponseType = HttpResponse<IPieceComptable[]>;

@Injectable({ providedIn: 'root' })
export class PieceComptableService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/piece-comptables');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(pieceComptable: NewPieceComptable): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pieceComptable);
    return this.http
      .post<RestPieceComptable>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(pieceComptable: IPieceComptable): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pieceComptable);
    return this.http
      .put<RestPieceComptable>(`${this.resourceUrl}/${this.getPieceComptableIdentifier(pieceComptable)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(pieceComptable: PartialUpdatePieceComptable): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pieceComptable);
    return this.http
      .patch<RestPieceComptable>(`${this.resourceUrl}/${this.getPieceComptableIdentifier(pieceComptable)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPieceComptable>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPieceComptable[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPieceComptableIdentifier(pieceComptable: Pick<IPieceComptable, 'id'>): number {
    return pieceComptable.id;
  }

  comparePieceComptable(o1: Pick<IPieceComptable, 'id'> | null, o2: Pick<IPieceComptable, 'id'> | null): boolean {
    return o1 && o2 ? this.getPieceComptableIdentifier(o1) === this.getPieceComptableIdentifier(o2) : o1 === o2;
  }

  addPieceComptableToCollectionIfMissing<Type extends Pick<IPieceComptable, 'id'>>(
    pieceComptableCollection: Type[],
    ...pieceComptablesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pieceComptables: Type[] = pieceComptablesToCheck.filter(isPresent);
    if (pieceComptables.length > 0) {
      const pieceComptableCollectionIdentifiers = pieceComptableCollection.map(
        pieceComptableItem => this.getPieceComptableIdentifier(pieceComptableItem)!,
      );
      const pieceComptablesToAdd = pieceComptables.filter(pieceComptableItem => {
        const pieceComptableIdentifier = this.getPieceComptableIdentifier(pieceComptableItem);
        if (pieceComptableCollectionIdentifiers.includes(pieceComptableIdentifier)) {
          return false;
        }
        pieceComptableCollectionIdentifiers.push(pieceComptableIdentifier);
        return true;
      });
      return [...pieceComptablesToAdd, ...pieceComptableCollection];
    }
    return pieceComptableCollection;
  }

  protected convertDateFromClient<T extends IPieceComptable | NewPieceComptable | PartialUpdatePieceComptable>(
    pieceComptable: T,
  ): RestOf<T> {
    return {
      ...pieceComptable,
      datePiece: pieceComptable.datePiece?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPieceComptable: RestPieceComptable): IPieceComptable {
    return {
      ...restPieceComptable,
      datePiece: restPieceComptable.datePiece ? dayjs(restPieceComptable.datePiece) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPieceComptable>): HttpResponse<IPieceComptable> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPieceComptable[]>): HttpResponse<IPieceComptable[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
