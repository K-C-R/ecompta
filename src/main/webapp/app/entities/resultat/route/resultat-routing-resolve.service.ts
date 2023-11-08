import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IResultat } from '../resultat.model';
import { ResultatService } from '../service/resultat.service';

export const resultatResolve = (route: ActivatedRouteSnapshot): Observable<null | IResultat> => {
  const id = route.params['id'];
  if (id) {
    return inject(ResultatService)
      .find(id)
      .pipe(
        mergeMap((resultat: HttpResponse<IResultat>) => {
          if (resultat.body) {
            return of(resultat.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default resultatResolve;
