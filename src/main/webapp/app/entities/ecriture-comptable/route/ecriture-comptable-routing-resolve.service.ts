import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEcritureComptable } from '../ecriture-comptable.model';
import { EcritureComptableService } from '../service/ecriture-comptable.service';

export const ecritureComptableResolve = (route: ActivatedRouteSnapshot): Observable<null | IEcritureComptable> => {
  const id = route.params['id'];
  if (id) {
    return inject(EcritureComptableService)
      .find(id)
      .pipe(
        mergeMap((ecritureComptable: HttpResponse<IEcritureComptable>) => {
          if (ecritureComptable.body) {
            return of(ecritureComptable.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default ecritureComptableResolve;
