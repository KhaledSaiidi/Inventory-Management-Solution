import {  APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HistoryComponent } from './components/history/history.component';
import { NotificationComponent } from './components/notification/notification.component';
import { environment } from 'src/environments/environment';
import { SendNotificationComponent } from './components/send-notification/send-notification.component';
import { CheckComponent } from './components/check/check.component';
import { SellComponent } from './components/sell/sell.component';
import { ReturnComponent } from './components/return/return.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path:'notification', component: NotificationComponent, canActivate: [AuthGuard]},
  { path:'history', component: HistoryComponent, canActivate: [AuthGuard]},
  { path:'send', component: SendNotificationComponent, canActivate: [AuthGuard]},
  { path:'check', component: CheckComponent, canActivate: [AuthGuard]},
  { path:'sell', component: SellComponent, canActivate: [AuthGuard]},
  { path:'return', component: ReturnComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      initOptions: {
        checkLoginIframe: true,
      },
      enableBearerInterceptor: true,
    });

}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    HistoryComponent,
    NotificationComponent,
    SendNotificationComponent,
    CheckComponent,
    SellComponent,
    ReturnComponent
  ],
  imports: [
    BrowserModule,
     IonicModule.forRoot(),
     AppRoutingModule,
     HttpClientModule,
     ReactiveFormsModule,
     FormsModule,
     KeycloakAngularModule,
     RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService,
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
  }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
