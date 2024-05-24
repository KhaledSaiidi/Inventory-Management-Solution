import { Component, OnInit } from '@angular/core';
import { Productdto } from 'src/app/models/inventory/ProductDto';
import { SoldProductDto } from 'src/app/models/inventory/SoldProductDto';
import { AuthService } from 'src/app/services/auth.service';
// import { SecurityService } from 'src/app/services/security.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent  implements OnInit {

  constructor ( public securityService: AuthService, private stockservice: StockService) {}
  username: string = "";
  async ngOnInit() {
    await this.loadUserProfile();
    this.getThelast4ReturnedProdsByusername(this.username);
    this.getThelast4SoldProdsByusername(this.username);
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
  showsell: boolean = true;
  showreturn: boolean = false;
  showsells() {
    this.showsell = true;
    this.showreturn = false;
  }

  showreturns() {
    this.showsell = false;
    this.showreturn = true;
  }
  lastsoldProds: SoldProductDto[] = [];
  lastreturnedProds: Productdto[] = [];
  emptylastReturnss: boolean = true;
  emptylastsells: boolean = true;


  getThelast4ReturnedProdsByusername(username: string) {
    this.emptylastReturnss = true;
      this.stockservice.getThelast4ReturnedProdsByusername(username)
        .subscribe(
          (products: Productdto[]) => {
            this.lastreturnedProds = [];
            this.lastreturnedProds = products;
            if(this.lastreturnedProds && this.lastreturnedProds.length > 0) {
              this.emptylastReturnss = false;
            }
          },
          (error) => {
            console.error('Error fetching last products returned:', error);
          }
        );
    }  
    getThelast4SoldProdsByusername(username: string) {
      this.emptylastsells = true;
      this.stockservice.getThelast4SoldProdsByusername(username)
        .subscribe(
          (products: SoldProductDto[]) => {
            this.lastsoldProds = [];
            this.lastsoldProds = products;
            if(this.lastsoldProds && this.lastsoldProds.length > 0){
              this.emptylastsells = false;
            }
          },
          (error) => {
            console.error('Error fetching last products returned:', error);
          }
        );
    }  

}
