import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { GrandLivreComponent } from './list/grand-livre.component';
import { GrandLivreDetailComponent } from './detail/grand-livre-detail.component';
import { GrandLivreUpdateComponent } from './update/grand-livre-update.component';
import GrandLivreResolve from './route/grand-livre-routing-resolve.service';

const grandLivreRoute: Routes = [
  {
    path: '',
    component: GrandLivreComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GrandLivreDetailComponent,
    resolve: {
      grandLivre: GrandLivreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GrandLivreUpdateComponent,
    resolve: {
      grandLivre: GrandLivreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GrandLivreUpdateComponent,
    resolve: {
      grandLivre: GrandLivreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default grandLivreRoute;
