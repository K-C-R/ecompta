import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRapportsPersonnalises } from '../rapports-personnalises.model';
import { RapportsPersonnalisesService } from '../service/rapports-personnalises.service';

export const rapportsPersonnalisesResolve = (route: ActivatedRouteSnapshot): Observable<null | IRapportsPersonnalises> => {
  const id = route.params['id'];
  if (id) {
    return inject(RapportsPersonnalisesService)
      .find(id)
      .pipe(
        mergeMap((rapportsPersonnalises: HttpResponse<IRapportsPersonnalises>) => {
          if (rapportsPersonnalises.body) {
            return of(rapportsPersonnalises.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default rapportsPersonnalisesResolve;
