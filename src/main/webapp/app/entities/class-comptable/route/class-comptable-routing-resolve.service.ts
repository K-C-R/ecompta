import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClassComptable } from '../class-comptable.model';
import { ClassComptableService } from '../service/class-comptable.service';

export const classComptableResolve = (route: ActivatedRouteSnapshot): Observable<null | IClassComptable> => {
  const id = route.params['id'];
  if (id) {
    return inject(ClassComptableService)
      .find(id)
      .pipe(
        mergeMap((classComptable: HttpResponse<IClassComptable>) => {
          if (classComptable.body) {
            return of(classComptable.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default classComptableResolve;
