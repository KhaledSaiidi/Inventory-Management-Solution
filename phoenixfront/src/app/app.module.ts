import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseComponent } from './component/base/base.component';
import { RouterModule, Routes } from '@angular/router';
import { KeycloakAngularModule } from 'keycloak-angular';
import { KeycloakService } from 'keycloak-angular';
import { AuthGuard } from './guards/security.guard';
import { SecurityService } from './services/security.service'
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { OpenscanComponent } from './component/scanner/openscan/openscan.component';
import { WebcamModule } from 'ngx-webcam';
import { AgentsComponent } from './component/agents/agents.component';
import { AddteamComponent } from './component/addteam/addteam.component';


const appRoute: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  {path:'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER"] }},
  {path:'toscan', component: OpenscanComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER"] }},
  {path:'agents', component: AgentsComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER"] }},
  {path:'addteam', component: AddteamComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER"] }}

]

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
    BaseComponent,
    DashboardComponent,
    OpenscanComponent,
    AgentsComponent,
    AddteamComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoute),
    ReactiveFormsModule,
    FormsModule,
    KeycloakAngularModule,
    WebcamModule
  ],
  providers: [
    KeycloakService,
    SecurityService,
    {
      provide: APP_INITIALIZER,
      useFactory: kcFactory,
      multi: true,
      deps: [KeycloakService, SecurityService],
    },
    ],  bootstrap: [AppComponent]
})
export class AppModule { }
