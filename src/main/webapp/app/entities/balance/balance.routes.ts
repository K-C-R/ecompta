import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { BalanceComponent } from './list/balance.component';
import { BalanceDetailComponent } from './detail/balance-detail.component';
import { BalanceUpdateComponent } from './update/balance-update.component';
import BalanceResolve from './route/balance-routing-resolve.service';

const balanceRoute: Routes = [
  {
    path: '',
    component: BalanceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BalanceDetailComponent,
    resolve: {
      balance: BalanceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BalanceUpdateComponent,
    resolve: {
      balance: BalanceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BalanceUpdateComponent,
    resolve: {
      balance: BalanceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default balanceRoute;
