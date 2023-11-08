import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICompteDeResultat } from '../compte-de-resultat.model';
import { CompteDeResultatService } from '../service/compte-de-resultat.service';

export const compteDeResultatResolve = (route: ActivatedRouteSnapshot): Observable<null | ICompteDeResultat> => {
  const id = route.params['id'];
  if (id) {
    return inject(CompteDeResultatService)
      .find(id)
      .pipe(
        mergeMap((compteDeResultat: HttpResponse<ICompteDeResultat>) => {
          if (compteDeResultat.body) {
            return of(compteDeResultat.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default compteDeResultatResolve;
