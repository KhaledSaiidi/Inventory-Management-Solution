import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { delay, switchMap, timer } from 'rxjs';
import { ReclamType } from 'src/app/models/notifications/ReclamType';
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
             public stompService: StompService, public notificationService: NotificationService) {}
username: string = "";
isManager: boolean = this.securityService.hasRoleIn(['MANAGER', 'IMANAGER']);

public ngOnInit() {
  if (this.securityService.profile && this.securityService.profile.username) {
    console.log(this.securityService.profile);
    this.username = this.securityService.profile.username;
  }
  this.refreshnotifications();
  this.initializeWebSocket();
}

private initializeWebSocket(): void {
  this.stompService.subscribe('/topic/notification', (): any => {
    this.refreshnotifications();
  });
}


  onLogout() {
    this.securityService.kcService.logout(window.location.origin);
  }

  
  navigateToscanners(userName?: string) {
    if (userName === undefined) {
      console.log('Invalid Username');
      return;
    }
    this.router.navigate(['/scanners'], { queryParams: { id: userName } });      
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

  navigateToProds(){
    window.location.href = '/navigateprods';
  }
  refreshnotifications(){
    this.getreclamations();
  }

  reclamations: ReclamationDto[] = [];
  emptyreclamaations: boolean = true;
  notificationnumber : number = 0;
  receiver: string= "";
  reclamationsnotSeen: ReclamationDto[] = [];

  getreclamations(){
    this.receiver = this.username;
    this.notificationService.getNewReclamations(this.receiver).subscribe(
      (data) => {
    this.reclamations = data as ReclamationDto[];
    this.notificationnumber = 0;
    if(this.reclamations.length > 0){
      this.emptyreclamaations =false;
      this.reclamations.forEach(reclamation => {
        if (!reclamation.vuedreceivers || !reclamation.vuedreceivers.includes(this.username)) {
            this.notificationnumber++;
            this.reclamationsnotSeen.push(reclamation);
        }
    }); 
    console.log("reclamations not seen" + this.reclamationsnotSeen.map(obj => JSON.stringify(obj)));
      }
      },
      (error) => {
        console.error('Failed to get reclamations:', error);
      }
    );
  
}

ifUserSeentrue(notification: ReclamationDto): boolean {
  if (notification.vuedreceivers != null && notification.vuedreceivers.includes(this.username)) {
    return true;
  } 
  return false; 
  }

  terminatenotif(): void {
    timer(2000)
      .pipe(
        switchMap(() => this.notificationService.terminateNotification(this.username, this.reclamationsnotSeen)),
        delay(2000)
      )
      .subscribe(
        () => {
          this.notificationnumber = 0;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  navigateToUserNotifications(userName?: string) {
    if (userName === undefined) {
      console.log('Invalid Username');
      return;
    }
    this.router.navigate(['/userdetails'], { 
      queryParams: { 
        id: userName,
        selectedTab: 2
      } 
    });      
  }
   
  
}
