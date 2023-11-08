import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBalance } from '../balance.model';
import { BalanceService } from '../service/balance.service';

export const balanceResolve = (route: ActivatedRouteSnapshot): Observable<null | IBalance> => {
  const id = route.params['id'];
  if (id) {
    return inject(BalanceService)
      .find(id)
      .pipe(
        mergeMap((balance: HttpResponse<IBalance>) => {
          if (balance.body) {
            return of(balance.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default balanceResolve;
