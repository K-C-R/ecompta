import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AuditComponent } from './list/audit.component';
import { AuditDetailComponent } from './detail/audit-detail.component';
import { AuditUpdateComponent } from './update/audit-update.component';
import AuditResolve from './route/audit-routing-resolve.service';

const auditRoute: Routes = [
  {
    path: '',
    component: AuditComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AuditDetailComponent,
    resolve: {
      audit: AuditResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AuditUpdateComponent,
    resolve: {
      audit: AuditResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AuditUpdateComponent,
    resolve: {
      audit: AuditResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default auditRoute;
