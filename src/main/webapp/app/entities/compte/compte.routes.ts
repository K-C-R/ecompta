import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CompteComponent } from './list/compte.component';
import { CompteDetailComponent } from './detail/compte-detail.component';
import { CompteUpdateComponent } from './update/compte-update.component';
import CompteResolve from './route/compte-routing-resolve.service';

const compteRoute: Routes = [
  {
    path: '',
    component: CompteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CompteDetailComponent,
    resolve: {
      compte: CompteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CompteUpdateComponent,
    resolve: {
      compte: CompteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CompteUpdateComponent,
    resolve: {
      compte: CompteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default compteRoute;
