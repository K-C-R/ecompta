import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICompteComptable } from '../compte-comptable.model';
import { CompteComptableService } from '../service/compte-comptable.service';

export const compteComptableResolve = (route: ActivatedRouteSnapshot): Observable<null | ICompteComptable> => {
  const id = route.params['id'];
  if (id) {
    return inject(CompteComptableService)
      .find(id)
      .pipe(
        mergeMap((compteComptable: HttpResponse<ICompteComptable>) => {
          if (compteComptable.body) {
            return of(compteComptable.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default compteComptableResolve;
