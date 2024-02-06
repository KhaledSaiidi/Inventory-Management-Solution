import {  Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Stockdto } from 'src/app/models/inventory/Stock';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit{
  
  constructor(private router: Router, private stockService: StockService) {}

  filterfinishforStocks: Stockdto[] = [];
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;
  loading: boolean = true;
  emptyStock: boolean = true;
  
  searchTerm: string = '';
  ngOnInit() {
    this.getStocks(0, this.searchTerm);
  }
  getStocks(page: number, search: string) {
    this.stockService.getStockWithCampaigns(page, this.pageSize, search)
      .subscribe(stocksPage => {
        this.loading = false;
        this.currentPage = stocksPage.number + 1;
        this.filterfinishforStocks = stocksPage.content;
        this.totalPages = stocksPage.totalPages;
        this.checkAndSetEmptyStocks();
      }, (error) => {
        this.loading = false;
        console.error('Failed to fetch stocks:', error);
          });
  }

  private checkAndSetEmptyStocks() {
    if(this.filterfinishforStocks && this.filterfinishforStocks.length > 0)  {
      this.emptyStock = false;
    } else {
      this.emptyStock = true;
    }
  }
  searchDebounce: any;
  searchStocks() {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      let formattedSearchTerm: string = this.parseSearchTerm(this.searchTerm);
      this.getStocks(0, formattedSearchTerm);
    }, 1000);
  }
  
  parseSearchTerm(searchTerm: string): string {
    searchTerm = this.searchTerm.toLowerCase();
    const monthsMap: { [key: string]: string } = {
      jan: "01",
      feb: "02",
      mar: "03",
      apr: "04",
      may: "05",
      jun: "06",
      jul: "07",
      aug: "08",
      sep: "09",
      oct: "10",
      nov: "11",
      dec: "12"
    };
  
    const firstThreeChars = searchTerm.toLowerCase().substr(0, 3);
    if (firstThreeChars in monthsMap) {
      // Replace month names with corresponding numbers
      searchTerm = searchTerm.replace(new RegExp(firstThreeChars, "ig"), monthsMap[firstThreeChars]);

      // Check if the searchTerm contains "MONTH DAY" pattern
      const monthDayRegex = /(\b[a-z]{3}\b)\s*(\d{2})/i;
      const monthDayMatch = searchTerm.match(monthDayRegex);
      if (monthDayMatch) {
        const month = monthsMap[monthDayMatch[1]];
        const day = monthDayMatch[2];
        searchTerm = `${month}-${day}`;
      }
      
      // Check if the searchTerm contains "MONTH DAY, YEAR" pattern
      const monthDayYearRegex = /(\b[a-z]{3}\b)\s*(\d{2}),\s*(\d{4})/i;
      const monthDayYearMatch = searchTerm.match(monthDayYearRegex);
      if (monthDayYearMatch) {
        const month = monthsMap[monthDayYearMatch[1]];
        const day = monthDayYearMatch[2];
        const year = monthDayYearMatch[3];
        searchTerm = `${year}-${month}-${day}`;
      }
    
    }
    return searchTerm;
  }
    

  onPageChange(newPage: number): void {
      this.getStocks(newPage - 1, this.searchTerm);
  }  

  navigateToProducts(ref?: string) {
    if (ref === undefined) {
      console.log('Invalid ref');
      return;
    }
    this.router.navigate(['/products'], { queryParams: { id: ref } });     
    console.log(ref);
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


