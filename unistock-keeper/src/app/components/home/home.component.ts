import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {

  constructor (public securityService: AuthService ,  private router: Router, 
    private stockservice: StockService) {}
username: string = "";
 isThisManager!: boolean;
 async  ngOnInit() {
  await this.loadUserProfile();
  console.log("isManager :" + this.isThisManager);
  console.log(this.username);
  this.getStocksByStocksReferences();
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
    if(this.stockreference) {
    this.router.navigate(['/check'], { 
      queryParams: { 
        id: this.stockreference
      } 
    });  
   } else {
      this.nostock = true;
    }               
  }

  sellItem() {
    if(this.stockreference) {
      this.router.navigate(['/sell'], { 
        queryParams: { 
          id: this.stockreference
        } 
      });  
     } else {
        this.nostock = true;
      }               
    }
    
  returnItem() {
    if(this.stockreference) {
      this.router.navigate(['/return'], { 
        queryParams: { 
          id: this.stockreference
        } 
      });  
     } else {
        this.nostock = true;
      }               
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
  nostock: boolean = false;
  stockreference!: string;
  selectedStock: string ="Select a stock to proceed !";
  extractStockReference(selectedValue: string) {
    const stockReference = selectedValue.split(' ')[0];
    this.stockreference = stockReference
    console.log(stockReference);
  }
  stockReferences: string[] = [];
  getStocksByStocksReferences() {
    this.stockservice.getStocksByStocksReferences().subscribe(
      (data) => {
        this.stockReferences = data as string[];        
      },
      (error: any) => {
        console.error('Error fetching agents:', error);
      }
    );
  }

}
