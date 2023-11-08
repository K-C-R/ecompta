import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import locale from '@angular/common/locales/fr';
// import { AppComponent } from './app.component';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
// import { NgxWebstorageModule } from 'ngx-webstorage';
import dayjs from 'dayjs/esm';
import { NgbActiveModal, NgbDateAdapter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import './config/dayjs';
// import { SharedModule } from 'app/shared/shared.module';
import { TranslationModule } from 'app/shared/language/translation.module';
import { AppRoutingModule } from './app-routing.module';
// import { HomeModule } from './home/home.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { NgbDateDayjsAdapter } from './config/datepicker-adapter';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import { httpInterceptorProviders } from 'app/core/interceptor/index';
// import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppFooterComponent } from './layout/app.footer.component';
import { AppMenuComponent } from './layout/app.menu.component';
import { AppMenuitemComponent } from './layout/app.menuitem.component';
import { AppSidebarComponent } from './layout/app.sidebar.component';
import { AppTopBarComponent } from './layout/app.topbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
// import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { AppConfigModule } from './layout/config/config.module';
import { TableModule } from 'primeng/table';
// import { TicketModule } from './entities/ticket/ticket.module';
// import { MessageService } from 'primeng/api';
import PageRibbonComponent from './layouts/profiles/page-ribbon.component';
import ErrorComponent from './layouts/error/error.component';
import FooterComponent from './layouts/footer/footer.component';
import MainComponent from './layouts/main/main.component';
import ActiveMenuDirective from './layouts/navbar/active-menu.directive';
import NavbarComponent from './layouts/navbar/navbar.component';
import { AccordionModule } from 'primeng/accordion';
import { HomeModule } from './home/home.module';

// import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    AppRoutingModule,
    // Set this to true to enable service worker (PWA)
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    HttpClientModule,
    // NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-', caseSensitive: true }),
    TranslationModule,
    BrowserAnimationsModule,
    InputTextModule,
    SidebarModule,
    HomeModule,
    // InputSwitchModule,
    RippleModule,
    AppConfigModule,
    TableModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },

    Title,
    { provide: LOCALE_ID, useValue: 'fr' },
    { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },
    httpInterceptorProviders,
    // MessageService,
    NgbActiveModal,
  ],
  declarations: [
    MainComponent,
    // NavbarComponent,
    // ErrorComponent,
    AppMenuitemComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppMenuComponent,
    AppSidebarComponent,
    // PageRibbonComponent,
    // ActiveMenuDirective,
    // FooterComponent,
  ],
  bootstrap: [MainComponent],
})
export class AppModule {
  constructor(applicationConfigService: ApplicationConfigService, iconLibrary: FaIconLibrary, dpConfig: NgbDatepickerConfig) {
    applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    registerLocaleData(locale);
    iconLibrary.addIcons(...fontAwesomeIcons);
    dpConfig.minDate = { year: dayjs().subtract(100, 'year').year(), month: 1, day: 1 };
  }
}
