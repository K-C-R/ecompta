import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICompteAttente, NewCompteAttente } from '../compte-attente.model';

export type PartialUpdateCompteAttente = Partial<ICompteAttente> & Pick<ICompteAttente, 'id'>;

export type EntityResponseType = HttpResponse<ICompteAttente>;
export type EntityArrayResponseType = HttpResponse<ICompteAttente[]>;

@Injectable({ providedIn: 'root' })
export class CompteAttenteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/compte-attentes');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(compteAttente: NewCompteAttente): Observable<EntityResponseType> {
    return this.http.post<ICompteAttente>(this.resourceUrl, compteAttente, { observe: 'response' });
  }

  update(compteAttente: ICompteAttente): Observable<EntityResponseType> {
    return this.http.put<ICompteAttente>(`${this.resourceUrl}/${this.getCompteAttenteIdentifier(compteAttente)}`, compteAttente, {
      observe: 'response',
    });
  }

  partialUpdate(compteAttente: PartialUpdateCompteAttente): Observable<EntityResponseType> {
    return this.http.patch<ICompteAttente>(`${this.resourceUrl}/${this.getCompteAttenteIdentifier(compteAttente)}`, compteAttente, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICompteAttente>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICompteAttente[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCompteAttenteIdentifier(compteAttente: Pick<ICompteAttente, 'id'>): number {
    return compteAttente.id;
  }

  compareCompteAttente(o1: Pick<ICompteAttente, 'id'> | null, o2: Pick<ICompteAttente, 'id'> | null): boolean {
    return o1 && o2 ? this.getCompteAttenteIdentifier(o1) === this.getCompteAttenteIdentifier(o2) : o1 === o2;
  }

  addCompteAttenteToCollectionIfMissing<Type extends Pick<ICompteAttente, 'id'>>(
    compteAttenteCollection: Type[],
    ...compteAttentesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const compteAttentes: Type[] = compteAttentesToCheck.filter(isPresent);
    if (compteAttentes.length > 0) {
      const compteAttenteCollectionIdentifiers = compteAttenteCollection.map(
        compteAttenteItem => this.getCompteAttenteIdentifier(compteAttenteItem)!,
      );
      const compteAttentesToAdd = compteAttentes.filter(compteAttenteItem => {
        const compteAttenteIdentifier = this.getCompteAttenteIdentifier(compteAttenteItem);
        if (compteAttenteCollectionIdentifiers.includes(compteAttenteIdentifier)) {
          return false;
        }
        compteAttenteCollectionIdentifiers.push(compteAttenteIdentifier);
        return true;
      });
      return [...compteAttentesToAdd, ...compteAttenteCollection];
    }
    return compteAttenteCollection;
  }
}
