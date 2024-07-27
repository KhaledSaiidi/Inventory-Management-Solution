import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiramtionDialogComponent } from 'src/app/design-component/confiramtion-dialog/confiramtion-dialog.component';
import { Productdto } from 'src/app/models/inventory/ProductDto';
import { ProductPage } from 'src/app/models/inventory/ProductPage';
import { SoldProductDto } from 'src/app/models/inventory/SoldProductDto';
import { SoldProductPage } from 'src/app/models/inventory/SoldProductPage';
import { Stockdto } from 'src/app/models/inventory/Stock';
import { DataSharingService } from 'src/app/services/dataSharing.service';
import { SecurityService } from 'src/app/services/security.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-navigateprods',
  templateUrl: './navigateprods.component.html',
  styleUrls: ['./navigateprods.component.css']
})
export class NavigateprodsComponent {
  @Input() selectedTab: number = 0;

  constructor( 
    private route: ActivatedRoute, private router: Router,
    private stockservice: StockService, private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer, private dataSharingService: DataSharingService,
    private dialog: MatDialog, private securityService: SecurityService) {}
    
    enable: boolean = false;
    productdto?: Productdto;  
    selectedRowIndex: number | null = null;
    isManager: boolean = this.securityService.hasRoleIn(['MANAGER', 'IMANAGER']);
    showTooltip(productdto: Productdto) {
      this.enable=true;
        this.productdto = productdto;
    }
    hideTooltip() {
      this.enable=false;
     }
  
  async ngOnInit() { 
    try {
      await this.getProductsByStockReference(0, this.searchTerm);
      this.cdRef.detectChanges();
    } catch (error) {
      this.filterfinishforProds = [];
        }
    
    try {
      await this.getSoldProductsByStockReference(0, this.searchTerm);
      this.cdRef.detectChanges();
    } catch (error) {
      this.filterfinishforSoldProds = [];
        }

    try {
      await this.getReturnedProductsByStockReference(0, this.searchTerm);
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
  pageSize: number = 50;
  filterfinishforProds: Productdto[] = [];
  pagedProducts: Productdto[][] = [];
  searchTerm: string = '';

  
  getProductsByStockReference(page: number, search: string) {
    this.loading = true;
    try {
      this.stockservice.getAllProductsPaginated(page, this.pageSize, search)
        .subscribe(
          (productPage: ProductPage) => {
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

searchDebounce: any;
searchWithoutspaces!: string;
searchStocks() {
  this.searchWithoutspaces = this.searchTerm.replace(/\s/g, '');

  clearTimeout(this.searchDebounce);
  if(this.selectedTab === 0){
  this.searchDebounce = setTimeout(() => {
    this.getProductsByStockReference(0, this.searchWithoutspaces);
  }, 600); }
  if(this.selectedTab === 1){
    this.searchDebounce = setTimeout(() => {
      this.getSoldProductsByStockReference(0, this.searchWithoutspaces);
    }, 600); }
    if(this.selectedTab === 2){
      this.searchDebounce = setTimeout(() => {
      this.getReturnedProductsByStockReference(0, this.searchWithoutspaces);
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


onPageChange(newPage: number): void {
    this.getProductsByStockReference(newPage - 1, this.searchTerm);
} 
        


  navigateToUpdateProduct(ref1?: string, ref2?: string) {
    if (ref1 === undefined || ref2 === undefined) {
      console.log('Invalid refs');
      return;
    }
    this.router.navigate(['/updateproduct'], { queryParams: { id: ref1, prodId: ref2,selectedTab: this.selectedTab  } });
  }
  
  selectedFile: File | null = null;
  selectedSheetIndex!: number;
  nonselectedSheetIndexToenter: boolean = false;
  onInputChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    let newValue = parseInt(inputValue, 10);
    if (newValue < 1 || isNaN(newValue)) {
      newValue = 1;
    }
    this.selectedSheetIndex = newValue;
  }

  
  

    selectedTabProf(){
      this.selectedTab = 0;
      this.searchTerm = '';
      this.getProductsByStockReference(0, this.searchTerm);
    }
    selectedTabMyStock() {
      this.selectedTab = 1;
      this.searchTerm = '';
      this.getSoldProductsByStockReference(0, this.searchTerm);

    }
    selectedTabMessages() {
      this.selectedTab = 2;
      this.searchTerm = '';
      this.getReturnedProductsByStockReference(0, this.searchTerm);
    }


    loadingSold: boolean = true;
    emptySoldProducts: boolean = true;
    totalPagesSoldProd: number = 0;
    totalElementsSoldProd: number = 0;
    currentPageSoldProd: number = 0;
    filterfinishforSoldProds: SoldProductDto[] = [];
    pagedsoldProducts: SoldProductDto[][] = [];
  
    getSoldProductsByStockReference(page: number, search: string) {
      this.loading = true;
      try {
        this.stockservice.getSoldProductsPaginated(page, this.pageSize, search)
          .subscribe(
            (soldproductPage: SoldProductPage) => {
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
        this.getSoldProductsByStockReference(newPage - 1, this.searchTerm);
    } 
   



      returnloading: boolean = true;
      emptyReturnProducts: boolean = true;
      totalReturnPages: number = 0;
      totalReturnlements: number = 0;  
      currentReturnPage: number = 0;
      returnProds: Productdto[] = [];
      pagedReturnProducts: Productdto[][] = [];
    
      
      getReturnedProductsByStockReference(page: number, search: string) {
        this.returnloading = true;
        try {
          this.stockservice.getAllReturnedProductsPaginated(page, this.pageSize, search)
            .subscribe(
              (productPage: ProductPage) => {
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
      this.getReturnedProductsByStockReference(newPage - 1, this.searchTerm);
  } 
 



}
