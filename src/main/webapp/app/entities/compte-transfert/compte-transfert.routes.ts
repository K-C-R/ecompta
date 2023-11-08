import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CompteTransfertComponent } from './list/compte-transfert.component';
import { CompteTransfertDetailComponent } from './detail/compte-transfert-detail.component';
import { CompteTransfertUpdateComponent } from './update/compte-transfert-update.component';
import CompteTransfertResolve from './route/compte-transfert-routing-resolve.service';

const compteTransfertRoute: Routes = [
  {
    path: '',
    component: CompteTransfertComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CompteTransfertDetailComponent,
    resolve: {
      compteTransfert: CompteTransfertResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CompteTransfertUpdateComponent,
    resolve: {
      compteTransfert: CompteTransfertResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CompteTransfertUpdateComponent,
    resolve: {
      compteTransfert: CompteTransfertResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default compteTransfertRoute;
