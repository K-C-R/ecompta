import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ResultatComponent } from './list/resultat.component';
import { ResultatDetailComponent } from './detail/resultat-detail.component';
import { ResultatUpdateComponent } from './update/resultat-update.component';
import ResultatResolve from './route/resultat-routing-resolve.service';

const resultatRoute: Routes = [
  {
    path: '',
    component: ResultatComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ResultatDetailComponent,
    resolve: {
      resultat: ResultatResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ResultatUpdateComponent,
    resolve: {
      resultat: ResultatResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ResultatUpdateComponent,
    resolve: {
      resultat: ResultatResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default resultatRoute;
