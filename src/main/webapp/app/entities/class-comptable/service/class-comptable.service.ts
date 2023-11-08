import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClassComptable, NewClassComptable } from '../class-comptable.model';

export type PartialUpdateClassComptable = Partial<IClassComptable> & Pick<IClassComptable, 'id'>;

export type EntityResponseType = HttpResponse<IClassComptable>;
export type EntityArrayResponseType = HttpResponse<IClassComptable[]>;

@Injectable({ providedIn: 'root' })
export class ClassComptableService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/class-comptables');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(classComptable: NewClassComptable): Observable<EntityResponseType> {
    return this.http.post<IClassComptable>(this.resourceUrl, classComptable, { observe: 'response' });
  }

  update(classComptable: IClassComptable): Observable<EntityResponseType> {
    return this.http.put<IClassComptable>(`${this.resourceUrl}/${this.getClassComptableIdentifier(classComptable)}`, classComptable, {
      observe: 'response',
    });
  }

  partialUpdate(classComptable: PartialUpdateClassComptable): Observable<EntityResponseType> {
    return this.http.patch<IClassComptable>(`${this.resourceUrl}/${this.getClassComptableIdentifier(classComptable)}`, classComptable, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClassComptable>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClassComptable[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getClassComptableIdentifier(classComptable: Pick<IClassComptable, 'id'>): number {
    return classComptable.id;
  }

  compareClassComptable(o1: Pick<IClassComptable, 'id'> | null, o2: Pick<IClassComptable, 'id'> | null): boolean {
    return o1 && o2 ? this.getClassComptableIdentifier(o1) === this.getClassComptableIdentifier(o2) : o1 === o2;
  }

  addClassComptableToCollectionIfMissing<Type extends Pick<IClassComptable, 'id'>>(
    classComptableCollection: Type[],
    ...classComptablesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const classComptables: Type[] = classComptablesToCheck.filter(isPresent);
    if (classComptables.length > 0) {
      const classComptableCollectionIdentifiers = classComptableCollection.map(
        classComptableItem => this.getClassComptableIdentifier(classComptableItem)!,
      );
      const classComptablesToAdd = classComptables.filter(classComptableItem => {
        const classComptableIdentifier = this.getClassComptableIdentifier(classComptableItem);
        if (classComptableCollectionIdentifiers.includes(classComptableIdentifier)) {
          return false;
        }
        classComptableCollectionIdentifiers.push(classComptableIdentifier);
        return true;
      });
      return [...classComptablesToAdd, ...classComptableCollection];
    }
    return classComptableCollection;
  }
}
