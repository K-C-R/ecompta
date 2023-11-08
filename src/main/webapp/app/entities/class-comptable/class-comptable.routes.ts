import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ClassComptableComponent } from './list/class-comptable.component';
import { ClassComptableDetailComponent } from './detail/class-comptable-detail.component';
import { ClassComptableUpdateComponent } from './update/class-comptable-update.component';
import ClassComptableResolve from './route/class-comptable-routing-resolve.service';

const classComptableRoute: Routes = [
  {
    path: '',
    component: ClassComptableComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClassComptableDetailComponent,
    resolve: {
      classComptable: ClassComptableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClassComptableUpdateComponent,
    resolve: {
      classComptable: ClassComptableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClassComptableUpdateComponent,
    resolve: {
      classComptable: ClassComptableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default classComptableRoute;
