import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit{
constructor (public securityService: SecurityService) { 
}
public ngOnInit() {
  if (this.securityService.profile) {
    console.log(this.securityService.profile);
  }
}

  onLogout() {
    this.securityService.kcService.logout(window.location.origin);
  }
}
