import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AboutComponent } from './about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { FeatureComponent } from './feature/feature.component';
import { HeaderComponent } from './header/header.component';
import { NewsComponent } from './news/news.component';
import { PortComponent } from './port/port.component';
import { ServdetailsComponent } from './servdetails/servdetails.component';
import { ServsComponent } from './servs/servs.component';
import { StatsComponent } from './stats/stats.component';
import { TeamComponent } from './team/team.component';
import { TestoComponent } from './testo/testo.component';
import { AllnewsComponent } from './allnews/allnews.component';
import { NewsdetailsComponent } from './newsdetails/newsdetails.component';
import { LoginComponent } from './login/login.component';
import { AddnewsComponent } from './addnews/addnews.component';
import { PartnersComponent } from './partners/partners.component';

const routes: Routes = [
  { path: 'Phoenixmashome', component: HomeComponent },
  { path: 'services', component: ServdetailsComponent },
  { path: 'allnews', component: AllnewsComponent },
  { path: 'newsdetails/:id', component: NewsdetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'addnews', component: AddnewsComponent },
  { path: '**', redirectTo: '/Phoenixmashome', pathMatch: 'full' }
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    FooterComponent,
    FeatureComponent,
    HeaderComponent,
    NewsComponent,
    PortComponent,
    ServdetailsComponent,
    ServsComponent,
    StatsComponent,
    TeamComponent,
    TestoComponent,
    AllnewsComponent,
    NewsdetailsComponent,
    LoginComponent,
    AddnewsComponent,
    PartnersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
