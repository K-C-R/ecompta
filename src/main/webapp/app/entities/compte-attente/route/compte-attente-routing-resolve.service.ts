import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICompteAttente } from '../compte-attente.model';
import { CompteAttenteService } from '../service/compte-attente.service';

export const compteAttenteResolve = (route: ActivatedRouteSnapshot): Observable<null | ICompteAttente> => {
  const id = route.params['id'];
  if (id) {
    return inject(CompteAttenteService)
      .find(id)
      .pipe(
        mergeMap((compteAttente: HttpResponse<ICompteAttente>) => {
          if (compteAttente.body) {
            return of(compteAttente.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default compteAttenteResolve;
