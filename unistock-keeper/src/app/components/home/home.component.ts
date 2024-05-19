import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {

  constructor ( public securityService: AuthService ,  private router: Router) {}
username: string = "";
 isThisManager!: boolean;
 async  ngOnInit() {
  await this.loadUserProfile();
  console.log("isManager :" + this.isThisManager);
  console.log(this.username);
  }


  private async loadUserProfile() {
    if (!this.securityService.profile) {
      try {
        await this.securityService.kcService.loadUserProfile();
        this.securityService.profile = await this.securityService.kcService.loadUserProfile();
      } catch (error) {
        console.error('Failed to load user profile', error);
        return;
      }
    }
    if (this.securityService.profile && this.securityService.profile.username) {
      console.log(this.securityService.profile);
      this.username = this.securityService.profile.username;
      this.isThisManager = this.securityService.hasRoleIn(['IMANAGER', 'MANAGER']);
      console.log('isThisManager after role check:', this.isThisManager);
    }
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

}
