import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICompteTransfert } from '../compte-transfert.model';
import { CompteTransfertService } from '../service/compte-transfert.service';

export const compteTransfertResolve = (route: ActivatedRouteSnapshot): Observable<null | ICompteTransfert> => {
  const id = route.params['id'];
  if (id) {
    return inject(CompteTransfertService)
      .find(id)
      .pipe(
        mergeMap((compteTransfert: HttpResponse<ICompteTransfert>) => {
          if (compteTransfert.body) {
            return of(compteTransfert.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default compteTransfertResolve;
