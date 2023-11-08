import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { SoldeComptableComponent } from './list/solde-comptable.component';
import { SoldeComptableDetailComponent } from './detail/solde-comptable-detail.component';
import { SoldeComptableUpdateComponent } from './update/solde-comptable-update.component';
import SoldeComptableResolve from './route/solde-comptable-routing-resolve.service';

const soldeComptableRoute: Routes = [
  {
    path: '',
    component: SoldeComptableComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SoldeComptableDetailComponent,
    resolve: {
      soldeComptable: SoldeComptableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SoldeComptableUpdateComponent,
    resolve: {
      soldeComptable: SoldeComptableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SoldeComptableUpdateComponent,
    resolve: {
      soldeComptable: SoldeComptableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default soldeComptableRoute;
