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


export function kcFactory(kcService: KeycloakService, securityService: SecurityService) {
  return () => {
    return new Promise<void>((resolve, reject) => {
      kcService.init({
        config: {
          realm: "phoenixstock",
          clientId: "front-client",
          url: "http://localhost:8181"
        },
        initOptions: {
          onLoad: "login-required"
        }
      }).then(() => {
        kcService.loadUserProfile().then(profile => {
          securityService.profile = profile;
          resolve();
        });
      }).catch((error) => {
        reject(error);
      });
    });
  };
}



@NgModule({
  declarations: [    
    AppComponent,
    HomeComponent,
   HeaderComponent,
   FooterComponent,
   CheckComponent,
   SellComponent,
   ReturnComponent,
   NotificationComponent
],
  imports: [    
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    KeycloakAngularModule, 
    HttpClientModule,
],
  providers: [
    { 
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy 
    }, 
    KeycloakService,
    SecurityService,
    StompService,
    {
      provide: APP_INITIALIZER,
      useFactory: kcFactory,
      multi: true,
      deps: [KeycloakService, SecurityService],
    }
  ],
  bootstrap: [AppComponent],
})

export class AppModule {}
