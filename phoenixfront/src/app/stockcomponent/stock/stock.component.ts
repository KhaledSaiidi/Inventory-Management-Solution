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
    this.getStocksWithCampaigns(0, 5);
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
  totalPages: number = 0;
  totalElements: number = 0;
  currentPage: number = 1;

  getStocksWithCampaigns(page: number, size: number): void {
    this.stockservice.getStockWithCampaigns(page, size).subscribe(
      (data) => {
        this.stocks = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.currentPage = data.number + 1;
        this.loading = false;
  
        if (this.stocks.length > 0) {
          this.emptyStock = false;
          console.log("emptyStock: " + this.emptyStock);
        }
      },
      (error) => {
        console.error('Failed to fetch stocks:', error);
        this.loading = false;
      }
    );
  }  
  
  onPageChange(newPage: number): void {
    const pageSize = 5;
    this.getStocksWithCampaigns(newPage - 1, pageSize);
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
