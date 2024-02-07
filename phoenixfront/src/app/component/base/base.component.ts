import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit{
constructor (public securityService: SecurityService, private router: Router) { 
}
public ngOnInit() {
  if (this.securityService.profile) {
    console.log(this.securityService.profile);
  }
}

  onLogout() {
    this.securityService.kcService.logout(window.location.origin);
  }

  navigateToscan() {
    this.router.navigate(['/toscan']);
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
}
