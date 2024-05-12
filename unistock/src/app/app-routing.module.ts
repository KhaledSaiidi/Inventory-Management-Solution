import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { AuthGuard } from './services/authGuard';
import { CheckComponent } from './component/check/check.component';
import { NotificationComponent } from './component/notification/notification.component';
import { HeaderComponent } from './component/header/header.component';

const routes: Routes = [
  {
    path:'home', component: HomeComponent,
    canActivate: [AuthGuard],
    data: { roles: ["IMANAGER", "MANAGER", "AGENT"] }
  },
  {
    path:'check', component: CheckComponent,
    canActivate: [AuthGuard],
    data: { roles: ["IMANAGER", "MANAGER"] }
  },
  {
    path:'notification', component: NotificationComponent,
    canActivate: [AuthGuard],
    data: { roles: ["IMANAGER", "MANAGER", "AGENT"] }
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
