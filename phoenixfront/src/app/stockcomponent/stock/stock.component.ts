import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { Productdto } from 'src/app/models/inventory/ProductDto';
import { Stockdto } from 'src/app/models/inventory/Stock';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit{
  constructor(private router: Router, private stockservice: StockService) {}
  stocks!: Stockdto[];
  ngOnInit(): void{
    this.getstockswithcampaigns();
    }

  ref!: string;
  navigateToProducts(ref?: string) {
    if (ref === undefined) {
      console.log('Invalid ref');
      return;
    }
    this.router.navigate(['/products'], { queryParams: { id: ref } });     
    console.log(ref);
  }
  loading: boolean = true;
  emptyStock: boolean = true;
  getstockswithcampaigns(){
    this.stockservice.getStockWithCampaigns().subscribe(
      (data) => {
    this.stocks = data as Stockdto[];
    this.loading = false;
    if(this.stocks.length > 0){
      this.emptyStock = false;
      console.log("emptyStock: " + this.emptyStock);
    }
      },
      (error) => {
        console.error('Failed to add team:', error);
        this.loading = false;
      }
    );
  }
  navigateToStockInfo(ref?: string) {
    if (ref === undefined) {
      console.log('Invalid ref');
      return;
    }
    this.router.navigate(['/stockinfo'], { queryParams: { id: ref } });
    console.log(ref);
  }

  navigateToUpdateStock(ref?: string) {
    if (ref === undefined) {
      console.log('Invalid ref');
      return;
    }
    this.router.navigate(['/updatestock'], { queryParams: { id: ref } });
    console.log(ref);
  }

}
