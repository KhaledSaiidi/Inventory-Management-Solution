import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReclamationDto } from 'src/app/models/notifications/ReclamationDto';
import { NotificationService } from 'src/app/services/notification.service';
import { SecurityService } from 'src/app/services/security.service';
import { StompService } from 'src/app/services/stomp.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit{
constructor (public securityService: SecurityService, private router: Router,
             public stompService: StompService, public notificationService: NotificationService) { 
              this.refreshnotifications();
}
public ngOnInit() {
  if (this.securityService.profile) {
    console.log(this.securityService.profile);
  }
  this.stompService.subscribe('/topic/notification', (): any => {
    this.refreshnotifications();
  }); 
}

  onLogout() {
    this.securityService.kcService.logout(window.location.origin);
  }

  navigateToscan() {
    window.location.href = '/toscan';
  }
  
  navigateTosell(userName?: string) {
    if (userName === undefined) {
      console.log('Invalid Username');
      return;
    }
    this.router.navigate(['/scantosell'], { queryParams: { id: userName } });      
  }

  navigateToreturn(userName?: string) {
    if (userName === undefined) {
      console.log('Invalid Username');
      return;
    }
    this.router.navigate(['/scantoreturn'], { queryParams: { id: userName } });      
  }
  
  navigateToUserdetails(userName?: string) {
    if (userName === undefined) {
      console.log('Invalid Username');
      return;
    }
    this.router.navigate(['/userdetails'], { queryParams: { id: userName } });      
  }
  navigateToStocks(){
    window.location.href = '/stocks';
  }

  refreshnotifications(){
    this.getreclamations();
  }

  reclamations: ReclamationDto[] = [];
  emptyreclamaations: boolean = true;
  notificationnumber : number = 0;

  getreclamations(){
    this.notificationService.getReclamations().subscribe(
      (data) => {
    this.reclamations = data as ReclamationDto[];
    this.notificationnumber = 0;
    if(this.reclamations.length > 0){
      this.emptyreclamaations =false;
      this.reclamations.forEach(reclamation => {
          this.notificationnumber++;
        
        
      });
      }
      },
      (error) => {
        console.error('Failed to get reclamations:', error);
      }
    );
  }

}
