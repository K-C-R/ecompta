import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { EcritureComptableComponent } from './list/ecriture-comptable.component';
import { EcritureComptableDetailComponent } from './detail/ecriture-comptable-detail.component';
import { EcritureComptableUpdateComponent } from './update/ecriture-comptable-update.component';
import EcritureComptableResolve from './route/ecriture-comptable-routing-resolve.service';

const ecritureComptableRoute: Routes = [
  {
    path: '',
    component: EcritureComptableComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EcritureComptableDetailComponent,
    resolve: {
      ecritureComptable: EcritureComptableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EcritureComptableUpdateComponent,
    resolve: {
      ecritureComptable: EcritureComptableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EcritureComptableUpdateComponent,
    resolve: {
      ecritureComptable: EcritureComptableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ecritureComptableRoute;
