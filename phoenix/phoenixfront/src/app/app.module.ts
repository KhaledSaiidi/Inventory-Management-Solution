import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseComponent } from './component/base/base.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { KeycloakAngularModule } from 'keycloak-angular';
import { KeycloakService } from 'keycloak-angular';
import { AuthGuard } from './guards/security.guard';
import { SecurityService } from './services/security.service'
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './component/dashboard/dashboard.component';
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
import { CustomPaginationComponent } from './design-component/custom-pagination/custom-pagination.component';
import { StocksComponent } from './stockcomponent/stocks/stocks.component';
import { AssignproductsComponent } from './stockcomponent/assignproducts/assignproducts.component';
import { ScanComponent } from './component/scan/scan.component';
import { SellprodComponent } from './component/sellprod/sellprod.component';
import { ReturnbyscanComponent } from './component/returnbyscan/returnbyscan.component';
import { StompService } from './services/stomp.service';
import { ComplaintComponent } from './component/complaint/complaint.component';
import { RestockingComponent } from './component/restocking/restocking.component'
import { ScannersComponent } from './component/scanners/scanners.component';
import { ConfiramtionDialogComponent } from './design-component/confiramtion-dialog/confiramtion-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StockarchivedComponent } from './stockcomponent/stockarchived/stockarchived.component';
import { ProdarchivedComponent } from './stockcomponent/prodarchived/prodarchived.component';
import { environment } from 'src/environments/environment';
import { NavigateprodsComponent } from './stockcomponent/navigateprods/navigateprods.component';

const appRoute: Routes = [
  {path:'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" ] }},
  {path:'agents', component: AgentsComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" ] }},
  {path:'addteam', component: AddteamComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER"] }},
  {path:'userinfos', component: UserInfoComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER"] }},
  { path:'userdetails', component: UserdetailsComponent, canActivate: [AuthGuard] },
  {path:'camapigns', component: CampaignsComponent, canActivate: [AuthGuard]},
  {path:'addclient', component: AddClientComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" ] }},
  {path:'addcampaign', component: AddcampaignComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" ] }},
  {path:'client', component: ClientComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" ] }},
  {path:'updatecamapign', component: UpdateCampaignComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" ] }},
  {path:'archive', component: ArchivedComponent, canActivate: [AuthGuard]},
  {path:'stocks', component: StocksComponent, canActivate: [AuthGuard]},
  {path:'addstock', component: AddstockComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" ] }},
  {path:'products', component: ProductsComponent, canActivate: [AuthGuard]},
  {path:'addproduct', component: AddproductComponent, canActivate: [AuthGuard]},
  {path:'updateproduct', component: UpdateprodComponent, canActivate: [AuthGuard]},
  {path:'stockinfo', component: StockinfoComponent, canActivate: [AuthGuard]},
  {path:'checkprods', component: CheckprodsComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" ] }},
  {path:'checkhistory', component: CheckhistoryComponent, canActivate: [AuthGuard]},
  {path:'updatestock', component: UpdatestockComponent, canActivate: [AuthGuard]},
  {path:'assignproducts', component: AssignproductsComponent, canActivate: [AuthGuard]},
  {path:'scanners', component: ScannersComponent, canActivate: [AuthGuard]},
  {path:'toscan', component: ScanComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" ] }},
  {path:'scantosell', component: SellprodComponent, canActivate: [AuthGuard]},
  {path:'scantoreturn', component: ReturnbyscanComponent, canActivate: [AuthGuard]},
  {path:'restocking', component: RestockingComponent, canActivate: [AuthGuard]},
  {path:'complaint', component: ComplaintComponent, canActivate: [AuthGuard]},
  {path:'stockarchive', component: StockarchivedComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" ] }},
  {path:'archivedproducts', component: ProdarchivedComponent, canActivate: [AuthGuard], data: { roles: ["IMANAGER" , "MANAGER" ] }},
  {path:'navigateprods', component: NavigateprodsComponent, canActivate: [AuthGuard]},
  { path: '**', pathMatch: 'full', redirectTo: '/dashboard' },
]

export function kcFactory(kcService: KeycloakService, securityService: SecurityService, router: Router) {
  return () => {
    return new Promise<void>((resolve, reject) => {
      kcService.init({
        config: {
          realm: environment.keycloak.realm,
          clientId:environment.keycloak.clientId,
          url: environment.keycloak.url
        },
        initOptions: {
          onLoad: "login-required"
        }
      }).then(() => {
        kcService.loadUserProfile().then(profile => {
          securityService.profile = profile;
          const userRoles = kcService.getUserRoles();
           if (userRoles.includes('AGENT')) {
              router.navigate(['/stocks']);  
          }
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
    StocksComponent,
    AssignproductsComponent,
    ScanComponent,
    SellprodComponent,
    ReturnbyscanComponent,
    ComplaintComponent,
    RestockingComponent,
    ScannersComponent,
    ConfiramtionDialogComponent,
    StockarchivedComponent,
    ProdarchivedComponent,
    NavigateprodsComponent
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
    MatDialogModule
  ],
  providers: [
    KeycloakService,
    SecurityService,
    StompService,
    {
      provide: APP_INITIALIZER,
      useFactory: kcFactory,
      multi: true,
      deps: [KeycloakService, SecurityService, Router],
    },
    ],  
  bootstrap: [AppComponent]
})
export class AppModule { }
