import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CompteComptableComponent } from './list/compte-comptable.component';
import { CompteComptableDetailComponent } from './detail/compte-comptable-detail.component';
import { CompteComptableUpdateComponent } from './update/compte-comptable-update.component';
import CompteComptableResolve from './route/compte-comptable-routing-resolve.service';

const compteComptableRoute: Routes = [
  {
    path: '',
    component: CompteComptableComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CompteComptableDetailComponent,
    resolve: {
      compteComptable: CompteComptableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CompteComptableUpdateComponent,
    resolve: {
      compteComptable: CompteComptableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CompteComptableUpdateComponent,
    resolve: {
      compteComptable: CompteComptableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default compteComptableRoute;
