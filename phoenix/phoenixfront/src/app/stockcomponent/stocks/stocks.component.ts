import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Stockdto } from 'src/app/models/inventory/Stock';
import { StockPage } from 'src/app/models/inventory/StockPage';
import { StockService } from 'src/app/services/stock.service';
import { ConfiramtionDialogComponent } from 'src/app/design-component/confiramtion-dialog/confiramtion-dialog.component'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit { 
  
  constructor(private router: Router, private stockService: StockService, 
              private sanitizer: DomSanitizer, private cdRef: ChangeDetectorRef,
              private dialog: MatDialog, private securityService: SecurityService) {}

  isManager: boolean = this.securityService.hasRoleIn(['MANAGER', 'IMANAGER']);
  filterfinishforStocks!: Stockdto[];
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;
  loading: boolean = true;
  emptyStock: boolean = true;
  
  searchTerm: string = '';
   ngOnInit() {
    try {
      this.getStocks(0, this.searchTerm);
      this.cdRef.detectChanges();
    } catch (error) {
      this.filterfinishforStocks = [];
        }
  }
  
    getStocks(page: number, search: string) {
    this.loading = true;
    try {
      this.stockService.getStockWithCampaigns(page, this.pageSize, search)
        .subscribe(
          (stocksPage: StockPage) => {
            this.loading = false;
            this.currentPage = stocksPage.number + 1;
            this.filterfinishforStocks = stocksPage.content;
            this.totalPages = stocksPage.totalPages;
            this.checkAndSetEmptyStocks();
            this.cdRef.detectChanges();
          },
          (error) => {
            console.error('Error fetching stocks:', error);
            this.loading = false;
          }
        );
    } catch (error) {
      console.error('Unexpected error:', error);
      this.loading = false;
    }
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
    }, 600);
  }
  
  formatDate(date: Date): string {
    const dateString = date.toString();
    const dateParts = dateString.split('-');
    const year = dateParts[0];
    const month = this.getMonthName(parseInt(dateParts[1]));
    let day = dateParts[2];
    return `${month} ${day}, ${year}`;
  }
  getMonthName(monthNumber: number): string {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[monthNumber - 1];
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
    }
    if (firstThreeChars in monthsMap  && !isNaN(parseInt(searchTerm.substr(3)))){
      console.log(parseInt(searchTerm.substr(3,4)));
      searchTerm = monthsMap[firstThreeChars] + '-' + searchTerm.substr(3);
      console.log(searchTerm);
    }
  
    if (firstThreeChars in monthsMap  && !isNaN(parseInt(searchTerm.substr(3,4))) && searchTerm.charAt(5) === "," ){
      let daySubstring = searchTerm.substr(3, 4);
      daySubstring = daySubstring.replace(/,/g, '');
      searchTerm = searchTerm.substr(7) + '-' + monthsMap[firstThreeChars] + '-' + daySubstring;
      console.log(searchTerm);
    }

    return searchTerm;
  }
    
  highlightMatch(value: string) : SafeHtml {
    if (this.searchTerm && value) {
      const regex = new RegExp(`(${this.searchTerm})`, 'gi');
      const highlightedValue = value.replace(regex, '<span style="background-color: yellow;">$1</span>');
      return this.sanitizer.bypassSecurityTrustHtml(highlightedValue);
    }
    return this.sanitizer.bypassSecurityTrustHtml(value);
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
  
  
  confirmStockDeletion(stock: Stockdto): void {
    const message = 'Are you sure you want to delete the entire stock: "' + stock?.stockReference 
    + '"?\nAll products inside will be deleted.';
    
    const dialogRef = this.dialog.open(ConfiramtionDialogComponent, {
      data: { message, onConfirm: () => this.deleteStock(stock, dialogRef) }
    });

    dialogRef.componentInstance.onCancel.subscribe(() => {
      dialogRef.close();
    });
  }


  deleteStock(stock: Stockdto, dialogRef: MatDialogRef<ConfiramtionDialogComponent>): void {
    if(stock.stockReference){
    this.stockService.deleteStock(stock.stockReference).subscribe(
      () => {
        console.log('stock deleted successfully.');
        this.getStocks(0, "");
        dialogRef.close();
      },
      (error) => {
        console.error('Error deleting stock:', error);
      }
    );}
  }

}