import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReclamationDto } from 'src/app/models/notifications/ReclamationDto';
import { NotificationService } from 'src/app/services/notification.service';
// import { SecurityService } from 'src/app/services/security.service';
import { StompService } from 'src/app/services/stomp.service';
import { Subscription, delay, switchMap, timer } from 'rxjs';
import { NotifsharedService } from 'src/app/services/notifshared.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit , OnDestroy{
  private notificationTerminatedSubscription!: Subscription;


  @Input() isSelectedBarcode: boolean = false;
  @Input() isSelectedHistory: boolean = false;
  @Input() isSelectedNotifications: boolean = false;

  constructor (
   public securityService: AuthService,  private router: Router,
    public stompService: StompService, public notificationService: NotificationService,
    private notifSharedService: NotifsharedService
  ) {}

  username: string = "";
  ngOnInit() {
    if (this.securityService.profile && this.securityService.profile.username) {
      console.log(this.securityService.profile);
      this.username = this.securityService.profile.username;
    } 
    this.refreshnotifications();
    this.initializeWebSocket();

    this.notificationTerminatedSubscription = this.notifSharedService.notificationTerminated$
    .subscribe(() => {
      this.refreshnotifications();
    });

    }

  navigateToNotifications(){
    this.router.navigate(['/notification']);      
  }

  navigateTohome(){
    this.router.navigate(['/home']);      
  }

  navigateToHistory(){
    this.router.navigate(['/history']);      
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
  notificationnumber : number = 0;
  receiver: string= "";

  getreclamations(){
    this.receiver = this.username;
    this.notificationService.getNewReclamations(this.receiver).subscribe(
      (data) => {
    this.reclamations = data as ReclamationDto[];
    this.notificationnumber = 0;
    if(this.reclamations.length > 0){
      this.reclamations.forEach(reclamation => {
        if (!reclamation.vuedreceivers || !reclamation.vuedreceivers.includes(this.username)) {
            this.notificationnumber++;
        }
    }); 
      }
      },
      (error) => {
        console.error('Failed to get reclamations:', error);
      }
    );
  
}


ngOnDestroy(): void {
  this.notificationTerminatedSubscription.unsubscribe();
}

}
