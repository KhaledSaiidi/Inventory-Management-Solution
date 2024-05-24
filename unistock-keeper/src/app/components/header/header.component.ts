import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Userdto } from 'src/app/models/agents/Userdto';
import { AgentService } from 'src/app/services/agent.service';
import { AuthService } from 'src/app/services/auth.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  constructor ( public securityService: AuthService,  private router: Router,
    private agentsService: AgentService, private stockservice: StockService,
    private alertController: AlertController
  ) {}
username: string = "";
user!: Userdto;

async ngOnInit() {    
  await this.loadUserProfile();
  this.getuserinfos(this.username);
  this.getUserStat(this.username);
}

  async refresh(){
    await this.loadUserProfile();
    this.getuserinfos(this.username);
    this.getUserStat(this.username);
  }
async triggerOnInit() {
  await this.loadUserProfile();
  this.getuserinfos(this.username);
  this.getUserStat(this.username);
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
  }
}


getBase64Image(): string {
  if (this.user.image) {
    return `data:image/png;base64,${this.user.image}`;
  } else {
    return '';
  }
}

onLogout() {
  this.securityService.logout();
}

userRole: string = "";
userJobTitle!: string;
firstName!: string;
lastname!: string;
email!: string;
phone!: number;

getuserinfos(code : string){
  if(code != null)
  this.agentsService.getuserbycode(code).subscribe((data) => {
    this.user = data as Userdto;
    this.userJobTitle = (this.user.jobTitle !== undefined) ? this.user.jobTitle : (this.userRole !== undefined) ? this.userRole : "";

    this.firstName = this.user.firstName !== undefined ? this.user.firstName : "";
    this.lastname = this.user.lastName !== undefined ? this.user.lastName : "";
    this.email = this.user.email !== undefined ? this.user.email : "";
    this.phone = this.user.phone !== undefined ? this.user.phone : 0;
    if(this.user.usertypemanager == true) {
      this.userRole = "Manager";
    } else {
      this.userRole = "Agent";
    }
      },
      (error) => {console.error(error);}
      );
    }

    associatedProds: number = 0;
    returnedProds: number = 0;
    soldProds: number = 0;

    getUserStat(username: string) {
      this.stockservice.getUserStat(username)
        .subscribe(
          (stats: number[]) => {
            this.associatedProds = stats[0];
            this.returnedProds = stats[1];
            this.soldProds = stats[2];
            console.log("stats are : " + stats);
          },
          (error) => {
            console.error('Error fetching last stats:', error.message);
            console.error('Error status:', error.status);
            if (error.error) {
              console.error('Error details:', error.error);
            }
          }
        );
    }
  
    navigateToSend(){
      this.router.navigate(['/send']);      
    }
}
