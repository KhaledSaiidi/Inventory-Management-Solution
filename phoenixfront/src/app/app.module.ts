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
import { UserInfoComponent } from './component/user-info/user-info.component';
import { UserdetailsComponent } from './component/userdetails/userdetails.component';
import { CampaignsComponent } from './component/campaigns/campaigns.component';
import { AddClientComponent } from './component/add-client/add-client.component';
import { AddcampaignComponent } from './component/addcampaign/addcampaign.component';
import { ClientComponent } from './component/client/client.component';
import { UpdateCampaignComponent } from './component/update-campaign/update-campaign.component';
import { ArchivedComponent } from './component/archived/archived.component';
import { AddstockComponent } from './stockcomponent/addstock/addstock.component';
import { ProductsComponent } from './stockcomponent/products/products.component';
import { AddproductComponent } from './stockcomponent/addproduct/addproduct.component';
import { NumericOnlyDirective } from './services/numericOnlyDirective';
import { UpdatestockComponent } from './stockcomponent/updatestock/updatestock.component';
import { UpdateprodComponent } from './stockcomponent/updateprod/updateprod.component';
import { StockinfoComponent } from './stockcomponent/stockinfo/stockinfo.component';
import { CheckprodsComponent } from './stockcomponent/checkprods/checkprods.component';
import { CheckhistoryComponent } from './stockcomponent/checkhistory/checkhistory.component';
import { CustomPaginationComponent } from './services/custom-pagination/custom-pagination.component';
import { StocksComponent } from './stockcomponent/stocks/stocks.component';

const appRoute: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  {path:'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" ,"AGENT"] }},
  {path:'toscan', component: OpenscanComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER", "AGENT"] }},
  {path:'agents', component: AgentsComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" ,"AGENT"] }},
  {path:'addteam', component: AddteamComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER"] }},
  {path:'userinfos', component: UserInfoComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER","AGENT"] }},
  {path:'userdetails', component: UserdetailsComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" , "AGENT"] }},
  {path:'camapigns', component: CampaignsComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" , "AGENT"] }},
  {path:'addclient', component: AddClientComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" , "AGENT"] }},
  {path:'addcampaign', component: AddcampaignComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" , "AGENT"] }},
  {path:'client', component: ClientComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" , "AGENT"] }},
  {path:'updatecamapign', component: UpdateCampaignComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" , "AGENT"] }},
  {path:'archive', component: ArchivedComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" , "AGENT"] }},
  {path:'stocks', component: StocksComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" , "AGENT"] }},
  {path:'addstock', component: AddstockComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" , "AGENT"] }},
  {path:'products', component: ProductsComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" , "AGENT"] }},
  {path:'addproduct', component: AddproductComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" , "AGENT"] }},
  {path:'updateproduct', component: UpdateprodComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" , "AGENT"] }},
  {path:'stockinfo', component: StockinfoComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" , "AGENT"] }},
  {path:'checkprods', component: CheckprodsComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" , "AGENT"] }},
  {path:'checkhistory', component: CheckhistoryComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" , "AGENT"] }},
  {path:'updatestock', component: UpdatestockComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" , "AGENT"] }}

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
    AddteamComponent,
    UserInfoComponent,
    UserdetailsComponent,
    CampaignsComponent,
    AddClientComponent,
    AddcampaignComponent,
    ClientComponent,
    UpdateCampaignComponent,
    ArchivedComponent,
    AddstockComponent,
    ProductsComponent,
    AddproductComponent,
    NumericOnlyDirective,
    UpdatestockComponent,
    UpdateprodComponent,
    StockinfoComponent,
    CheckprodsComponent,
    CheckhistoryComponent,
    CustomPaginationComponent,
    StocksComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoute),
    ReactiveFormsModule,
    FormsModule,
    KeycloakAngularModule,
    WebcamModule,
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
