import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAudit } from '../audit.model';
import { AuditService } from '../service/audit.service';

export const auditResolve = (route: ActivatedRouteSnapshot): Observable<null | IAudit> => {
  const id = route.params['id'];
  if (id) {
    return inject(AuditService)
      .find(id)
      .pipe(
        mergeMap((audit: HttpResponse<IAudit>) => {
          if (audit.body) {
            return of(audit.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default auditResolve;
