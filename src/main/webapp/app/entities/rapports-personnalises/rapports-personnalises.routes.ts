import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { RapportsPersonnalisesComponent } from './list/rapports-personnalises.component';
import { RapportsPersonnalisesDetailComponent } from './detail/rapports-personnalises-detail.component';
import { RapportsPersonnalisesUpdateComponent } from './update/rapports-personnalises-update.component';
import RapportsPersonnalisesResolve from './route/rapports-personnalises-routing-resolve.service';

const rapportsPersonnalisesRoute: Routes = [
  {
    path: '',
    component: RapportsPersonnalisesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RapportsPersonnalisesDetailComponent,
    resolve: {
      rapportsPersonnalises: RapportsPersonnalisesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RapportsPersonnalisesUpdateComponent,
    resolve: {
      rapportsPersonnalises: RapportsPersonnalisesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RapportsPersonnalisesUpdateComponent,
    resolve: {
      rapportsPersonnalises: RapportsPersonnalisesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default rapportsPersonnalisesRoute;
