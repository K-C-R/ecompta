import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGrandLivre } from '../grand-livre.model';
import { GrandLivreService } from '../service/grand-livre.service';

export const grandLivreResolve = (route: ActivatedRouteSnapshot): Observable<null | IGrandLivre> => {
  const id = route.params['id'];
  if (id) {
    return inject(GrandLivreService)
      .find(id)
      .pipe(
        mergeMap((grandLivre: HttpResponse<IGrandLivre>) => {
          if (grandLivre.body) {
            return of(grandLivre.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default grandLivreResolve;
