import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-scanners',
  templateUrl: './scanners.component.html',
  styleUrls: ['./scanners.component.css']
})
export class ScannersComponent implements OnInit{
  constructor(
    private router: Router, public securityService: SecurityService,
    private route: ActivatedRoute) {}
    isManager: boolean = this.securityService.hasRoleIn(['MANAGER', 'IMANAGER']);

    username!: string | null;
    ngOnInit() {
      this.route.queryParamMap.subscribe(params => {
        this.username = params.get('id');
      });
    }  

    navigateToscan() {
      this.router.navigate(['/toscan']);      
    }
    
    navigateTosell() {
      if (this.username === undefined) {
        console.log('Invalid Username');
        return;
      }
      this.router.navigate(['/scantosell'], { queryParams: { id: this.username } });      
    }
  
    navigateToreturn() {
      if (this.username === undefined) {
        console.log('Invalid Username');
        return;
      }
      this.router.navigate(['/scantoreturn'], { queryParams: { id: this.username } });      
    }
  
    navigateToUserdetails() {
      if (this.username === undefined) {
        console.log('Invalid Username');
        return;
      }
      this.router.navigate(['/userdetails'], { queryParams: { id: this.username } });      
    }}
