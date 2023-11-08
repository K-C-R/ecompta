import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICompteTransfert, NewCompteTransfert } from '../compte-transfert.model';

export type PartialUpdateCompteTransfert = Partial<ICompteTransfert> & Pick<ICompteTransfert, 'id'>;

export type EntityResponseType = HttpResponse<ICompteTransfert>;
export type EntityArrayResponseType = HttpResponse<ICompteTransfert[]>;

@Injectable({ providedIn: 'root' })
export class CompteTransfertService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/compte-transferts');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(compteTransfert: NewCompteTransfert): Observable<EntityResponseType> {
    return this.http.post<ICompteTransfert>(this.resourceUrl, compteTransfert, { observe: 'response' });
  }

  update(compteTransfert: ICompteTransfert): Observable<EntityResponseType> {
    return this.http.put<ICompteTransfert>(`${this.resourceUrl}/${this.getCompteTransfertIdentifier(compteTransfert)}`, compteTransfert, {
      observe: 'response',
    });
  }

  partialUpdate(compteTransfert: PartialUpdateCompteTransfert): Observable<EntityResponseType> {
    return this.http.patch<ICompteTransfert>(`${this.resourceUrl}/${this.getCompteTransfertIdentifier(compteTransfert)}`, compteTransfert, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICompteTransfert>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICompteTransfert[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCompteTransfertIdentifier(compteTransfert: Pick<ICompteTransfert, 'id'>): number {
    return compteTransfert.id;
  }

  compareCompteTransfert(o1: Pick<ICompteTransfert, 'id'> | null, o2: Pick<ICompteTransfert, 'id'> | null): boolean {
    return o1 && o2 ? this.getCompteTransfertIdentifier(o1) === this.getCompteTransfertIdentifier(o2) : o1 === o2;
  }

  addCompteTransfertToCollectionIfMissing<Type extends Pick<ICompteTransfert, 'id'>>(
    compteTransfertCollection: Type[],
    ...compteTransfertsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const compteTransferts: Type[] = compteTransfertsToCheck.filter(isPresent);
    if (compteTransferts.length > 0) {
      const compteTransfertCollectionIdentifiers = compteTransfertCollection.map(
        compteTransfertItem => this.getCompteTransfertIdentifier(compteTransfertItem)!,
      );
      const compteTransfertsToAdd = compteTransferts.filter(compteTransfertItem => {
        const compteTransfertIdentifier = this.getCompteTransfertIdentifier(compteTransfertItem);
        if (compteTransfertCollectionIdentifiers.includes(compteTransfertIdentifier)) {
          return false;
        }
        compteTransfertCollectionIdentifiers.push(compteTransfertIdentifier);
        return true;
      });
      return [...compteTransfertsToAdd, ...compteTransfertCollection];
    }
    return compteTransfertCollection;
  }
}
