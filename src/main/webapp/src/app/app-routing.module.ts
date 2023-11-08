import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: AppLayoutComponent,
          children: [
            { path: '' },
            { path: 'uikit' },
            { path: 'utilities' },
            { path: 'documentation' },
            { path: 'blocks' },
            { path: 'pages' },
          ],
        },
        { path: 'auth' },
        { path: 'landing' },
        { path: 'notfound', component: NotfoundComponent },
        { path: '**', redirectTo: '/notfound' },
      ],
      { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' },
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
