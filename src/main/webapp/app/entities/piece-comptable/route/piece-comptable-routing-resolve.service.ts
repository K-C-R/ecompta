import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPieceComptable } from '../piece-comptable.model';
import { PieceComptableService } from '../service/piece-comptable.service';

export const pieceComptableResolve = (route: ActivatedRouteSnapshot): Observable<null | IPieceComptable> => {
  const id = route.params['id'];
  if (id) {
    return inject(PieceComptableService)
      .find(id)
      .pipe(
        mergeMap((pieceComptable: HttpResponse<IPieceComptable>) => {
          if (pieceComptable.body) {
            return of(pieceComptable.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default pieceComptableResolve;
