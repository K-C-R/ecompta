import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICompteComptable, NewCompteComptable } from '../compte-comptable.model';

export type PartialUpdateCompteComptable = Partial<ICompteComptable> & Pick<ICompteComptable, 'id'>;

export type EntityResponseType = HttpResponse<ICompteComptable>;
export type EntityArrayResponseType = HttpResponse<ICompteComptable[]>;

@Injectable({ providedIn: 'root' })
export class CompteComptableService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/compte-comptables');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(compteComptable: NewCompteComptable): Observable<EntityResponseType> {
    return this.http.post<ICompteComptable>(this.resourceUrl, compteComptable, { observe: 'response' });
  }

  update(compteComptable: ICompteComptable): Observable<EntityResponseType> {
    return this.http.put<ICompteComptable>(`${this.resourceUrl}/${this.getCompteComptableIdentifier(compteComptable)}`, compteComptable, {
      observe: 'response',
    });
  }

  partialUpdate(compteComptable: PartialUpdateCompteComptable): Observable<EntityResponseType> {
    return this.http.patch<ICompteComptable>(`${this.resourceUrl}/${this.getCompteComptableIdentifier(compteComptable)}`, compteComptable, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICompteComptable>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICompteComptable[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCompteComptableIdentifier(compteComptable: Pick<ICompteComptable, 'id'>): number {
    return compteComptable.id;
  }

  compareCompteComptable(o1: Pick<ICompteComptable, 'id'> | null, o2: Pick<ICompteComptable, 'id'> | null): boolean {
    return o1 && o2 ? this.getCompteComptableIdentifier(o1) === this.getCompteComptableIdentifier(o2) : o1 === o2;
  }

  addCompteComptableToCollectionIfMissing<Type extends Pick<ICompteComptable, 'id'>>(
    compteComptableCollection: Type[],
    ...compteComptablesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const compteComptables: Type[] = compteComptablesToCheck.filter(isPresent);
    if (compteComptables.length > 0) {
      const compteComptableCollectionIdentifiers = compteComptableCollection.map(
        compteComptableItem => this.getCompteComptableIdentifier(compteComptableItem)!,
      );
      const compteComptablesToAdd = compteComptables.filter(compteComptableItem => {
        const compteComptableIdentifier = this.getCompteComptableIdentifier(compteComptableItem);
        if (compteComptableCollectionIdentifiers.includes(compteComptableIdentifier)) {
          return false;
        }
        compteComptableCollectionIdentifiers.push(compteComptableIdentifier);
        return true;
      });
      return [...compteComptablesToAdd, ...compteComptableCollection];
    }
    return compteComptableCollection;
  }
}
