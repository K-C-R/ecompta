import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRapportsPersonnalises, NewRapportsPersonnalises } from '../rapports-personnalises.model';

export type PartialUpdateRapportsPersonnalises = Partial<IRapportsPersonnalises> & Pick<IRapportsPersonnalises, 'id'>;

export type EntityResponseType = HttpResponse<IRapportsPersonnalises>;
export type EntityArrayResponseType = HttpResponse<IRapportsPersonnalises[]>;

@Injectable({ providedIn: 'root' })
export class RapportsPersonnalisesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rapports-personnalises');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(rapportsPersonnalises: NewRapportsPersonnalises): Observable<EntityResponseType> {
    return this.http.post<IRapportsPersonnalises>(this.resourceUrl, rapportsPersonnalises, { observe: 'response' });
  }

  update(rapportsPersonnalises: IRapportsPersonnalises): Observable<EntityResponseType> {
    return this.http.put<IRapportsPersonnalises>(
      `${this.resourceUrl}/${this.getRapportsPersonnalisesIdentifier(rapportsPersonnalises)}`,
      rapportsPersonnalises,
      { observe: 'response' },
    );
  }

  partialUpdate(rapportsPersonnalises: PartialUpdateRapportsPersonnalises): Observable<EntityResponseType> {
    return this.http.patch<IRapportsPersonnalises>(
      `${this.resourceUrl}/${this.getRapportsPersonnalisesIdentifier(rapportsPersonnalises)}`,
      rapportsPersonnalises,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRapportsPersonnalises>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRapportsPersonnalises[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRapportsPersonnalisesIdentifier(rapportsPersonnalises: Pick<IRapportsPersonnalises, 'id'>): number {
    return rapportsPersonnalises.id;
  }

  compareRapportsPersonnalises(o1: Pick<IRapportsPersonnalises, 'id'> | null, o2: Pick<IRapportsPersonnalises, 'id'> | null): boolean {
    return o1 && o2 ? this.getRapportsPersonnalisesIdentifier(o1) === this.getRapportsPersonnalisesIdentifier(o2) : o1 === o2;
  }

  addRapportsPersonnalisesToCollectionIfMissing<Type extends Pick<IRapportsPersonnalises, 'id'>>(
    rapportsPersonnalisesCollection: Type[],
    ...rapportsPersonnalisesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const rapportsPersonnalises: Type[] = rapportsPersonnalisesToCheck.filter(isPresent);
    if (rapportsPersonnalises.length > 0) {
      const rapportsPersonnalisesCollectionIdentifiers = rapportsPersonnalisesCollection.map(
        rapportsPersonnalisesItem => this.getRapportsPersonnalisesIdentifier(rapportsPersonnalisesItem)!,
      );
      const rapportsPersonnalisesToAdd = rapportsPersonnalises.filter(rapportsPersonnalisesItem => {
        const rapportsPersonnalisesIdentifier = this.getRapportsPersonnalisesIdentifier(rapportsPersonnalisesItem);
        if (rapportsPersonnalisesCollectionIdentifiers.includes(rapportsPersonnalisesIdentifier)) {
          return false;
        }
        rapportsPersonnalisesCollectionIdentifiers.push(rapportsPersonnalisesIdentifier);
        return true;
      });
      return [...rapportsPersonnalisesToAdd, ...rapportsPersonnalisesCollection];
    }
    return rapportsPersonnalisesCollection;
  }
}
