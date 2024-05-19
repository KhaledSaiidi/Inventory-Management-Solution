import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ReclamationDto } from 'src/app/models/notifications/ReclamationDto';
import { NotificationService } from 'src/app/services/notification.service';
// import { SecurityService } from 'src/app/services/security.service';
import { StompService } from 'src/app/services/stomp.service';
import { delay, switchMap, timer } from 'rxjs';
import { formatDate } from '@angular/common';
import { NotifsharedService } from 'src/app/services/notifshared.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent  implements OnInit {

  constructor(
    private alertController: AlertController, public securityService: AuthService,
    private router: Router, public stompService: StompService, private notifSharedService: NotifsharedService,
    public notificationService: NotificationService) { }
    
  username: string = "";
  async ngOnInit() {
    await this.loadUserProfile();
    this.refreshnotifications();
    this.initializeWebSocket();
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
  private initializeWebSocket(): void {
    this.stompService.subscribe('/topic/notification', (): any => {
      this.refreshnotifications();
    });
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


  terminatenotif(notif: ReclamationDto): void {
    const reclamations: ReclamationDto[] = [];
    reclamations.push(notif);
    this.notificationService.terminateNotification(this.username, reclamations)
      .subscribe(
        () => {
          this.notifSharedService.notifyNotificationTerminated();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  

  async itemClicked(notif: ReclamationDto) {
    const alert = await this.alertController.create({
      header: notif.senderReference,
      subHeader: this.formatDateToString(notif.reclamDate) ,
      message: notif.reclamationText,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.terminatenotif(notif);
          }
        }  
      ]
    });
    await alert.present();
  }

  formatDateToString(date: Date | undefined): string {
    if(date) {
    return formatDate(date, 'HH:mm, dd MMM', 'en-US');
  } else {
    return "";
  }
  }
  
}
