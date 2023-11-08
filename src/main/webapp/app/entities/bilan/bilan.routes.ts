import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { BilanComponent } from './list/bilan.component';
import { BilanDetailComponent } from './detail/bilan-detail.component';
import { BilanUpdateComponent } from './update/bilan-update.component';
import BilanResolve from './route/bilan-routing-resolve.service';

const bilanRoute: Routes = [
  {
    path: '',
    component: BilanComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BilanDetailComponent,
    resolve: {
      bilan: BilanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BilanUpdateComponent,
    resolve: {
      bilan: BilanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BilanUpdateComponent,
    resolve: {
      bilan: BilanResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default bilanRoute;
