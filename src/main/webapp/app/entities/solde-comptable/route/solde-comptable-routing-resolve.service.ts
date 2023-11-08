import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISoldeComptable } from '../solde-comptable.model';
import { SoldeComptableService } from '../service/solde-comptable.service';

export const soldeComptableResolve = (route: ActivatedRouteSnapshot): Observable<null | ISoldeComptable> => {
  const id = route.params['id'];
  if (id) {
    return inject(SoldeComptableService)
      .find(id)
      .pipe(
        mergeMap((soldeComptable: HttpResponse<ISoldeComptable>) => {
          if (soldeComptable.body) {
            return of(soldeComptable.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default soldeComptableResolve;
