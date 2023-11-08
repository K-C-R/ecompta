import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISoldeComptable, NewSoldeComptable } from '../solde-comptable.model';

export type PartialUpdateSoldeComptable = Partial<ISoldeComptable> & Pick<ISoldeComptable, 'id'>;

export type EntityResponseType = HttpResponse<ISoldeComptable>;
export type EntityArrayResponseType = HttpResponse<ISoldeComptable[]>;

@Injectable({ providedIn: 'root' })
export class SoldeComptableService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/solde-comptables');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(soldeComptable: NewSoldeComptable): Observable<EntityResponseType> {
    return this.http.post<ISoldeComptable>(this.resourceUrl, soldeComptable, { observe: 'response' });
  }

  update(soldeComptable: ISoldeComptable): Observable<EntityResponseType> {
    return this.http.put<ISoldeComptable>(`${this.resourceUrl}/${this.getSoldeComptableIdentifier(soldeComptable)}`, soldeComptable, {
      observe: 'response',
    });
  }

  partialUpdate(soldeComptable: PartialUpdateSoldeComptable): Observable<EntityResponseType> {
    return this.http.patch<ISoldeComptable>(`${this.resourceUrl}/${this.getSoldeComptableIdentifier(soldeComptable)}`, soldeComptable, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISoldeComptable>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISoldeComptable[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSoldeComptableIdentifier(soldeComptable: Pick<ISoldeComptable, 'id'>): number {
    return soldeComptable.id;
  }

  compareSoldeComptable(o1: Pick<ISoldeComptable, 'id'> | null, o2: Pick<ISoldeComptable, 'id'> | null): boolean {
    return o1 && o2 ? this.getSoldeComptableIdentifier(o1) === this.getSoldeComptableIdentifier(o2) : o1 === o2;
  }

  addSoldeComptableToCollectionIfMissing<Type extends Pick<ISoldeComptable, 'id'>>(
    soldeComptableCollection: Type[],
    ...soldeComptablesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const soldeComptables: Type[] = soldeComptablesToCheck.filter(isPresent);
    if (soldeComptables.length > 0) {
      const soldeComptableCollectionIdentifiers = soldeComptableCollection.map(
        soldeComptableItem => this.getSoldeComptableIdentifier(soldeComptableItem)!,
      );
      const soldeComptablesToAdd = soldeComptables.filter(soldeComptableItem => {
        const soldeComptableIdentifier = this.getSoldeComptableIdentifier(soldeComptableItem);
        if (soldeComptableCollectionIdentifiers.includes(soldeComptableIdentifier)) {
          return false;
        }
        soldeComptableCollectionIdentifiers.push(soldeComptableIdentifier);
        return true;
      });
      return [...soldeComptablesToAdd, ...soldeComptableCollection];
    }
    return soldeComptableCollection;
  }
}
