import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CompteAttenteComponent } from './list/compte-attente.component';
import { CompteAttenteDetailComponent } from './detail/compte-attente-detail.component';
import { CompteAttenteUpdateComponent } from './update/compte-attente-update.component';
import CompteAttenteResolve from './route/compte-attente-routing-resolve.service';

const compteAttenteRoute: Routes = [
  {
    path: '',
    component: CompteAttenteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CompteAttenteDetailComponent,
    resolve: {
      compteAttente: CompteAttenteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CompteAttenteUpdateComponent,
    resolve: {
      compteAttente: CompteAttenteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CompteAttenteUpdateComponent,
    resolve: {
      compteAttente: CompteAttenteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default compteAttenteRoute;
