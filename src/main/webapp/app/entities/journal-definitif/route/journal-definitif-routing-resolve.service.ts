import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJournalDefinitif } from '../journal-definitif.model';
import { JournalDefinitifService } from '../service/journal-definitif.service';

export const journalDefinitifResolve = (route: ActivatedRouteSnapshot): Observable<null | IJournalDefinitif> => {
  const id = route.params['id'];
  if (id) {
    return inject(JournalDefinitifService)
      .find(id)
      .pipe(
        mergeMap((journalDefinitif: HttpResponse<IJournalDefinitif>) => {
          if (journalDefinitif.body) {
            return of(journalDefinitif.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default journalDefinitifResolve;
