import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ArchivedProductPage } from 'src/app/models/archive/ArchivedProductPage';
import { ArchivedProductsDTO } from 'src/app/models/archive/ArchivedProductsDTO';
import { ArchivedSoldProductPage } from 'src/app/models/archive/ArchivedSoldProductPage';
import { ArchivedSoldProductsDTO } from 'src/app/models/archive/ArchivedSoldProductsDTO';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-prodarchived',
  templateUrl: './prodarchived.component.html',
  styleUrls: ['./prodarchived.component.css']
})
export class ProdarchivedComponent implements OnInit{
  selectedTab: number = 0;
  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private stockservice: StockService,
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer) {}
    enable: boolean = false;
    productdto?: ArchivedProductsDTO;  
    selectedRowIndex: number | null = null;
    showTooltip(productdto: ArchivedProductsDTO) {
      this.enable=true;
        this.productdto = productdto;
    }
    hideTooltip() {
      this.enable=false;
     }
  
  stockreference: string = '';

  async ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if(id != null){
      this.stockreference = id;
      }
    }); 
    try {
      await this.getProductsByStockReference(this.stockreference, 0, this.searchTerm);
      this.cdRef.detectChanges();
    } catch (error) {
      this.filterfinishforProds = [];
        }
    
    try {
      await this.getSoldProductsByStockReference(this.stockreference, 0, this.searchTerm);
      this.cdRef.detectChanges();
    } catch (error) {
      this.filterfinishforSoldProds = [];
        }

    try {
      await this.getReturnedProductsByStockReference(this.stockreference, 0, this.searchTerm);
      this.cdRef.detectChanges();
    } catch (error) {
     this.returnProds = [];
       }
  }

  loading: boolean = true;
  emptyProducts: boolean = true;
  totalPages: number = 0;
  totalElements: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  filterfinishforProds: ArchivedProductsDTO[] = [];
  pagedProducts: ArchivedProductsDTO[][] = [];
  searchTerm: string = '';

  
  getProductsByStockReference(ref: string, page: number, search: string) {
    this.loading = true;
    try {
      this.stockservice.getArchivedProductsPaginatedBystockReference(ref, page, this.pageSize, search)
        .subscribe(
          (productPage: ArchivedProductPage) => {
            this.loading = false;
            this.currentPage = productPage.number + 1;
            this.filterfinishforProds = productPage.content
            this.totalPages = productPage.totalPages;
            console.log(this.filterfinishforProds);
            this.checkAndSetEmptyProducts();
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

private checkAndSetEmptyProducts() {
  if(this.filterfinishforProds && this.filterfinishforProds.length > 0) {
    this.emptyProducts = false;
  } else {
    this.emptyProducts = true;
  }
}

onPageChange(newPage: number): void {
  this.getProductsByStockReference(this.stockreference, newPage - 1, this.searchTerm);
} 


searchDebounce: any;
searchWithoutspaces!: string;
searchStocks() {
  this.searchWithoutspaces = this.searchTerm.replace(/\s/g, '');

  clearTimeout(this.searchDebounce);
  if(this.selectedTab === 0){
  this.searchDebounce = setTimeout(() => {
    this.getProductsByStockReference(this.stockreference, 0, this.searchWithoutspaces);
  }, 600); }
  if(this.selectedTab === 1){
    this.searchDebounce = setTimeout(() => {
      this.getSoldProductsByStockReference(this.stockreference, 0, this.searchWithoutspaces);
    }, 600); }
    if(this.selectedTab === 2){
      this.searchDebounce = setTimeout(() => {
      this.getReturnedProductsByStockReference(this.stockreference, 0, this.searchWithoutspaces);
      }, 600); }
}


highlightMatch(value: string) : SafeHtml {
  if (this.searchTerm && value) {
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    const highlightedValue = value.replace(regex, '<span style="background-color: yellow;">$1</span>');
    return this.sanitizer.bypassSecurityTrustHtml(highlightedValue);
  }
  return this.sanitizer.bypassSecurityTrustHtml(value);
}
selectedTabProf(){
  this.selectedTab = 0;
  this.searchTerm = '';
  this.getProductsByStockReference(this.stockreference, 0, this.searchTerm);
}
selectedTabMyStock() {
  this.selectedTab = 1;
  this.searchTerm = '';
  this.getSoldProductsByStockReference(this.stockreference, 0, this.searchTerm);

}
selectedTabMessages() {
  this.selectedTab = 2;
  this.searchTerm = '';
}



loadingSold: boolean = true;
emptySoldProducts: boolean = true;
totalPagesSoldProd: number = 0;
totalElementsSoldProd: number = 0;
currentPageSoldProd: number = 0;
filterfinishforSoldProds: ArchivedSoldProductsDTO[] = [];
pagedsoldProducts: ArchivedSoldProductsDTO[][] = [];

getSoldProductsByStockReference(ref: string, page: number, search: string) {
  this.loading = true;
  try {
    this.stockservice.getArchivedSoldProductsPaginatedBystockReference(ref, page, this.pageSize, search)
      .subscribe(
        (soldproductPage: ArchivedSoldProductPage) => {
          this.loadingSold = false;
          this.currentPageSoldProd = soldproductPage.number + 1;
          this.filterfinishforSoldProds = soldproductPage.content;
          this.totalPagesSoldProd = soldproductPage.totalPages;
          this.checkAndSetEmptySoldProducts();
            this.cdRef.detectChanges();
        },
        (error) => {
          console.error('Error fetching stocks:', error);
          this.loading = false;
        }
      );
  } catch (error) {
    console.error('Unexpected error:', error);
    this.loadingSold = false;
  }
  }

  private checkAndSetEmptySoldProducts() {
    if(this.filterfinishforSoldProds && this.filterfinishforSoldProds.length > 0) {
      this.emptySoldProducts = false;
    } else {
      this.emptySoldProducts = true;
    }
  }
  
  onSoldProdPageChange(newPage: number): void {
    this.getSoldProductsByStockReference(this.stockreference, newPage - 1, this.searchTerm);
} 

returnloading: boolean = true;
emptyReturnProducts: boolean = true;
totalReturnPages: number = 0;
totalReturnlements: number = 0;  
currentReturnPage: number = 0;
returnProds: ArchivedProductsDTO[] = [];
pagedReturnProducts: ArchivedProductsDTO[][] = [];


getReturnedProductsByStockReference(ref: string, page: number, search: string) {
  this.returnloading = true;
  try {
    this.stockservice.getReturnedArchivedProductsPaginatedBystockReference(ref, page, this.pageSize, search)
      .subscribe(
        (productPage: ArchivedSoldProductPage) => {
          this.returnloading = false;
          this.currentReturnPage = productPage.number + 1;
          this.returnProds = productPage.content
          this.totalReturnPages = productPage.totalPages;
          this.checkAndSetEmptyReturnProducts();
            this.cdRef.detectChanges();
        },
        (error) => {
          console.error('Error fetching stocks:', error);
          this.returnloading = false;
        }
      );
  } catch (error) {
    console.error('Unexpected error:', error);
    this.returnloading = false;
  }
  }

private checkAndSetEmptyReturnProducts() {
if(this.returnProds && this.returnProds.length > 0) {
  this.emptyReturnProducts = false;
} else {
  this.emptyReturnProducts = true;
}
}

onReturnProdPageChange(newPage: number): void {
this.getReturnedProductsByStockReference(this.stockreference, newPage - 1, this.searchTerm);
} 



}
