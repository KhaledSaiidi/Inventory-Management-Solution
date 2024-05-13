import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.scss'],
})
export class SendNotificationComponent  implements OnInit {

  constructor (public securityService: SecurityService, private router: Router) { }
  isRestock: boolean = true;
  isComplaint: boolean = false;

  ngOnInit() {
    console.log("");
  }

  navigateTohome(){
      this.router.navigate(['/home']);      
  }

  handleRestockChange() {
    if (this.isRestock) {
      this.isComplaint = false;
    }
  }
  handleComplaintChange() {
    if (this.isComplaint) {
      this.isRestock = false;
    }
  }

}
