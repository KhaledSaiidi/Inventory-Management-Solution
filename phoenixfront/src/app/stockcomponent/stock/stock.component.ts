import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, debounceTime, forkJoin, map, of } from 'rxjs';
import { Productdto } from 'src/app/models/inventory/ProductDto';
import { Stockdto } from 'src/app/models/inventory/Stock';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit{
  constructor(private router: Router, private stockservice: StockService, private sanitizer: DomSanitizer) {}
  stocks!: Stockdto[];

  onSearchInputChange$ = new Subject<string>();

  ngOnInit(): void{
    this.getStocksWithCampaigns(0, 5);
    this.onSearchInputChange$
    .pipe(debounceTime(600))
    .subscribe(() => {
      const pageSize = 5;
      this.getStocksWithCampaigns(0, pageSize);
    });

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
  pageSize: number = 5;
  filterfinishforStocks: Stockdto[] = [];
  pagedStocks: Stockdto[][] = [];

  getStocksWithCampaigns(page: number, size: number): void {
    this.loading = true;
    this.stockservice.getStockWithCampaigns(page, size).subscribe(
      (data) => {
        this.handleStocksResponse(data);
      },
      (error) => {
        this.handleStocksError(error);
      }
    );
  }


  private handleStocksResponse(data: any) {
    this.stocks = data.content;
    this.totalPages = data.totalPages;
    this.totalElements = data.totalElements;
    this.currentPage = data.number + 1;
    this.loading = false;
    this.filterfinishforStocks = [];
  
    if (this.searchTerm) {
      this.handleSearchTerm();
    } else {
      this.addstocksToFilterFinish();
    }
  }
  private handleStocksError(error: any) {
    console.error('Failed to fetch stocks:', error);
    this.loading = false;
  }

  private handleSearchTerm() {
    const observables: Observable<Stockdto[]>[] = [];
    for (let currentPage = 0; currentPage < this.totalPages; currentPage++) {
      observables.push(
        this.stockservice.getStockWithCampaigns(currentPage, this.pageSize).pipe(
          map(pageData => pageData.content)
        )
      );
    }
    forkJoin(observables).subscribe(
      (pagesData: Stockdto[][]) => {
        this.filterfinishforStocks = [];
        const allMatchedStocks = this.getAllMatchedStocks(pagesData);
        this.totalPages = Math.ceil(allMatchedStocks.length / this.pageSize);
        this.pagedStocks = this.paginateStocks(allMatchedStocks, this.pageSize);
  
        this.filterfinishforStocks = this.pagedStocks[0];
        this.checkAndSetEmptyStocks();
      },
      (error) => {
        console.error('Failed to get products for page:', error);
        this.loading = false;
      }
    );
  }

  private getAllMatchedStocks(pagesData: Stockdto[][]): Stockdto[] {
    const datePipe = new DatePipe('en-US');


    const allMatchedStocks: Stockdto[] = [];
    pagesData.forEach(currentStocks => {
      const matchedStocks: Stockdto[] = currentStocks.filter(stock =>
        (stock.stockReference && stock.stockReference.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (stock.campaigndto?.campaignName && stock.campaigndto?.campaignName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (stock.campaigndto?.client?.companyName && stock.campaigndto?.client?.companyName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (stock.shippingDate && datePipe.transform(stock.shippingDate, 'MMM dd, yyyy')?.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (stock.dueDate && datePipe.transform(stock.dueDate, 'MMM dd, yyyy')?.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (stock.receivedDate && datePipe.transform(stock.receivedDate, 'MMM dd, yyyy')?.toLowerCase().includes(this.searchTerm.toLowerCase()))

        );
      allMatchedStocks.push(...matchedStocks);
    });
    return allMatchedStocks;
  }
  private paginateStocks(allMatchedStocks: Stockdto[], pageSize: number): Stockdto[][] {
    const pagedStocks: Stockdto[][] = [];
    for (let i = 0; i < allMatchedStocks.length; i++) {
      const currentPage = Math.floor(i / pageSize);
      if (!pagedStocks[currentPage]) {
        pagedStocks[currentPage] = [];
      }
      pagedStocks[currentPage].push(allMatchedStocks[i]);
    }
    return pagedStocks;
  }
  
  private addstocksToFilterFinish() {
    this.stocks.forEach(stock => this.filterfinishforStocks.push(stock));
    this.checkAndSetEmptyStocks();
  }
    
  private checkAndSetEmptyStocks() {
    if(this.filterfinishforStocks) {
    if (this.filterfinishforStocks.length > 0) {
      this.emptyStock = false;
    } else {
      this.emptyStock = true;
    }} else {
      this.emptyStock = true;
    }
  }
  


 /*   this.stockservice.getStockWithCampaigns(page, size).subscribe(
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
  }  */
  searchTerm: string = '';
  onSearchInputChange(): void {
    this.onSearchInputChange$.next(this.searchTerm);
  }

  onPageChange(newPage: number): void {
    if(this.searchTerm){
      const pageSize = 5;
      this.filterfinishforStocks = this.pagedStocks[newPage - 1];
      this.currentPage = newPage;
    } else {
    const pageSize = 5;
    this.getStocksWithCampaigns(newPage - 1, pageSize);
  }
  }  
  highlightMatch(value: string): SafeHtml {
    if (this.searchTerm && value) {
      const regex = new RegExp(`(${this.searchTerm})`, 'gi');
      const highlightedValue = value.replace(regex, '<span style="background-color: yellow;">$1</span>');
      return this.sanitizer.bypassSecurityTrustHtml(highlightedValue);
    }
    return this.sanitizer.bypassSecurityTrustHtml(value);
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
