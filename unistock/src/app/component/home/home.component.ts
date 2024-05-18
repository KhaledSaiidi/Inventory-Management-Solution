import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';
//import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {

  constructor ( public securityService: SecurityService,  private router: Router) {}
username: string = "";
// isThisManager: boolean = this.securityService.hasRoleIn(['IMANAGER', 'MANAGER']);
hasValidAccessToken$ = this.securityService.hasValidAccessToken$;
realmRoles$ = this.securityService.realmRoles$;
userProfile$ = this.securityService.userProfile$;

  public ngOnInit() {

   // if (this.securityService.profile && this.securityService.profile.username) {
     // console.log(this.securityService.profile);
     // this.username = this.securityService.profile.username;
   // }
    console.log("");
  }

  navigateTocheck(){
    this.router.navigate(['/check']);      
  }

  sellItem() {
    console.log("Scan button clicked");
  }
  
  returnItem() {
    console.log("Scan button clicked");
  }
  openHistory() {
    console.log("History button clicked");
  }

  openList() {
    console.log("List button clicked");
  }

  openOptions() {
    console.log("Options button clicked");
  }
  login() {
    console.log('login')
    this.securityService.login();
  }


}
