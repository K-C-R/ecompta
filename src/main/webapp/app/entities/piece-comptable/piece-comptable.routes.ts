import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PieceComptableComponent } from './list/piece-comptable.component';
import { PieceComptableDetailComponent } from './detail/piece-comptable-detail.component';
import { PieceComptableUpdateComponent } from './update/piece-comptable-update.component';
import PieceComptableResolve from './route/piece-comptable-routing-resolve.service';

const pieceComptableRoute: Routes = [
  {
    path: '',
    component: PieceComptableComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PieceComptableDetailComponent,
    resolve: {
      pieceComptable: PieceComptableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PieceComptableUpdateComponent,
    resolve: {
      pieceComptable: PieceComptableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PieceComptableUpdateComponent,
    resolve: {
      pieceComptable: PieceComptableResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default pieceComptableRoute;
