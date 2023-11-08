import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CompteDeResultatComponent } from './list/compte-de-resultat.component';
import { CompteDeResultatDetailComponent } from './detail/compte-de-resultat-detail.component';
import { CompteDeResultatUpdateComponent } from './update/compte-de-resultat-update.component';
import CompteDeResultatResolve from './route/compte-de-resultat-routing-resolve.service';

const compteDeResultatRoute: Routes = [
  {
    path: '',
    component: CompteDeResultatComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CompteDeResultatDetailComponent,
    resolve: {
      compteDeResultat: CompteDeResultatResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CompteDeResultatUpdateComponent,
    resolve: {
      compteDeResultat: CompteDeResultatResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CompteDeResultatUpdateComponent,
    resolve: {
      compteDeResultat: CompteDeResultatResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default compteDeResultatRoute;
