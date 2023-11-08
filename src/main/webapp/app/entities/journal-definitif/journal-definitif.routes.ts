import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { JournalDefinitifComponent } from './list/journal-definitif.component';
import { JournalDefinitifDetailComponent } from './detail/journal-definitif-detail.component';
import { JournalDefinitifUpdateComponent } from './update/journal-definitif-update.component';
import JournalDefinitifResolve from './route/journal-definitif-routing-resolve.service';

const journalDefinitifRoute: Routes = [
  {
    path: '',
    component: JournalDefinitifComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JournalDefinitifDetailComponent,
    resolve: {
      journalDefinitif: JournalDefinitifResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JournalDefinitifUpdateComponent,
    resolve: {
      journalDefinitif: JournalDefinitifResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JournalDefinitifUpdateComponent,
    resolve: {
      journalDefinitif: JournalDefinitifResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default journalDefinitifRoute;
