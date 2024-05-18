import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { SecurityService } from './services/security.service';
import { HomeComponent } from './component/home/home.component';
import { FooterComponent } from './component/footer/footer.component';
import { HeaderComponent } from './component/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { CheckComponent } from './component/check/check.component';
import { SellComponent } from './component/sell/sell.component';
import { ReturnComponent } from './component/return/return.component';
import { NotificationComponent } from './component/notification/notification.component';
import { StompService } from './services/stomp.service';
import { HistoryComponent } from './component/history/history.component';
import { SendNotificationComponent } from './component/send-notification/send-notification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OAuthModule } from 'angular-oauth2-oidc';


@NgModule({
  declarations: [    
    AppComponent,
    HomeComponent,
   HeaderComponent,
   FooterComponent,
   CheckComponent,
   SellComponent,
   ReturnComponent,
   NotificationComponent,
   HistoryComponent,
   SendNotificationComponent
],
  imports: [    
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    OAuthModule.forRoot(),
],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SecurityService
  ],
  bootstrap: [AppComponent],
})

export class AppModule {}
