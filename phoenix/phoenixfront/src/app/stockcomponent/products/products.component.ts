import {  ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Productdto } from 'src/app/models/inventory/ProductDto';
import { Stockdto } from 'src/app/models/inventory/Stock';
import { StockService } from 'src/app/services/stock.service';
import { QueryList } from '@angular/core';
import { ProductPage } from 'src/app/models/inventory/ProductPage';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DataSharingService } from 'src/app/services/dataSharing.service';
import { SoldProductDto } from 'src/app/models/inventory/SoldProductDto';
import { SoldProductPage } from 'src/app/models/inventory/SoldProductPage';
import { ConfiramtionDialogComponent } from 'src/app/design-component/confiramtion-dialog/confiramtion-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
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
  
  stockreference: string = '';

  async ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      const selectedTab = params.get('selectedTab') || '0';
      if(id != null){
      this.stockreference = id;
      this.selectedTab = parseInt(selectedTab, 10);
      }
    }); 
    this.getStockbyRef(this.stockreference);
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
  navigateToAddProduct(ref?: string) {
    if (ref === undefined) {
      console.log('Invalid ref');
      return;
    }
   this.router.navigate(['/addproduct'], { queryParams: { id: ref } });     
  }
  stockdto!: Stockdto;
  campaignName!: string;
  getStockbyRef(ref : string){
    this.stockservice.getStockByreference(ref).subscribe(
      (data) => {
    this.stockdto = data as Stockdto;
    if(this.stockdto.campaigndto?.campaignName)
    this.campaignName = this.stockdto.campaigndto?.campaignName?.toUpperCase();
      },
      (error) => {
        console.error('Failed to get stock:', error);
      }
    );
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

  
  getProductsByStockReference(ref: string, page: number, search: string) {
    this.loading = true;
    try {
      this.stockservice.getProductsPaginatedByStockReference(ref, page, this.pageSize, search)
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


onPageChange(newPage: number): void {
    this.getProductsByStockReference(this.stockreference, newPage - 1, this.searchTerm);
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
  selectedSheetIndexToenter!: number;
  updateSheetIndex(): void {
    this.selectedSheetIndexToenter = Math.max(0, this.selectedSheetIndex - 1);
    console.log(this.selectedSheetIndexToenter);

  }

  onFileSelected(event: any): void {
    const fileInput = event.target as HTMLInputElement;
    const file: File = event.target.files[0] as File;
    const allowedExtensions = ['csv', 'xlsx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if(this.selectedSheetIndexToenter != null) {

    if (fileExtension && allowedExtensions.includes(fileExtension)) {
      if (fileExtension === 'xlsx') {
        this.convertExcelToCsv(file, this.selectedSheetIndexToenter);
      } else {
        this.selectedFile = file;
      }
    } else {
      console.error('Invalid file type. Please select a CSV or Excel file.');
    }
  } else {
    this.nonselectedSheetIndexToenter = true;
    fileInput.value = '';
  }
}

    convertExcelToCsv(excelFile: File, selectedSheetIndex: number){
      this.stockservice.excelToCsv(excelFile, selectedSheetIndex).subscribe(
        (csvFile: File) => {
          this.selectedFile = csvFile;
          console.log('Generated CSV file:', selectedSheetIndex);
        },
        error => {
          console.error('Error converting Excel to CSV:', error);
        }
      );
    }

    loadingForUpload: boolean = false;

    uploadFile(): void {
      if (this.selectedFile) {
        this.loadingForUpload = true;
        this.stockservice.addProdbyuploadFile(this.selectedFile, this.stockreference).subscribe(
          result => {
            this.loadingForUpload = false;
            location.reload();
          },
          error => {
            console.error('Error uploading file:', error);
            this.loadingForUpload = false;
          }
        );
      } else {
        console.error('No file selected.');
        this.loadingForUpload = false;
      }
  
    }
        

  navigateToCheckProds(ref?: string) {
    if (ref === undefined) {
      console.log('Invalid ref');
      return;
    }
    this.router.navigate(['/checkprods'], { queryParams: { id: ref } });     
  }

  selectAllChecked: boolean = false;
  selectedSerialNumbers: Set<string> = new Set<string>();
  isSelected(prod: Productdto): boolean {
    return prod.serialNumber !== undefined && this.selectedSerialNumbers.has(prod.serialNumber as string);
  }
  toggleCheckbox(prod: Productdto) {
    if (prod.serialNumber !== undefined) {
      if (this.selectedSerialNumbers.has(prod.serialNumber as string)) {
        this.selectedSerialNumbers.delete(prod.serialNumber as string);
      } else {
        this.selectedSerialNumbers.add(prod.serialNumber as string);
      }
    }
  }

  selectAllCheckbox(event: any) {
    this.selectAllChecked = event.target.checked;

    if (this.selectAllChecked) {
  this.filterfinishforProds.forEach(prod => {
    if (prod.serialNumber !== undefined) {
      this.selectedSerialNumbers.add(prod.serialNumber as string);
    }
  });
    }
    if (!this.selectAllChecked) {
      this.selectedSerialNumbers.clear();
    }

    
  }
  
  isEditMode = false;
  selectedProd: Productdto | null = null;
  editedBoxNumber: string | undefined;


  enableEditMode(prod: Productdto, index: number) {
    this.isEditMode = true;
    this.selectedProd = prod;
    this.editedBoxNumber = prod.boxNumber;
    setTimeout(() => {
      const inputField = document.getElementById('inputField' + index) as HTMLInputElement;
      if (inputField) {
        inputField.focus();
      }
    });
  }
  
    disableEditMode() {
    this.isEditMode = false;
    if (this.selectedProd) {
      this.selectedProd.boxNumber = this.editedBoxNumber;
      this.updateBoxNumber(this.selectedProd, this.editedBoxNumber);
    }
    this.selectedProd = null;
    this.editedBoxNumber = undefined;
  }
    
      
  handleTabKey(event: Event) {
   const keyboardEvent = event as KeyboardEvent;
    event.preventDefault();
    if (this.selectedProd) {
      const currentIndex = this.filterfinishforProds.indexOf(this.selectedProd);
      const nextIndex = (currentIndex + 1) % this.filterfinishforProds.length; 
      this.selectedProd.boxNumber = this.editedBoxNumber;
      this.updateBoxNumber(this.selectedProd, this.editedBoxNumber);
      this.selectedProd = this.filterfinishforProds[nextIndex];
      this.editedBoxNumber = this.selectedProd.boxNumber || undefined; 
      this.cdRef.detectChanges();
      setTimeout(() => {
        this.selectedProd = this.filterfinishforProds[nextIndex];
        if (this.selectedProd) {
          this.enableEditMode(this.selectedProd, nextIndex);
        }
      });
    }
  }

  handleShiftTabKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
     event.preventDefault();
     if (this.selectedProd) {
       const currentIndex = this.filterfinishforProds.indexOf(this.selectedProd);
       const previousIndex = currentIndex === 0 ? this.filterfinishforProds.length - 1 : currentIndex - 1;
       this.selectedProd.boxNumber = this.editedBoxNumber;
       this.updateBoxNumber(this.selectedProd, this.editedBoxNumber);
       this.selectedProd = this.filterfinishforProds[previousIndex];
       this.editedBoxNumber = this.selectedProd.boxNumber || undefined; 
       this.cdRef.detectChanges();
       setTimeout(() => {
         this.selectedProd = this.filterfinishforProds[previousIndex];
         if (this.selectedProd) {
           this.enableEditMode(this.selectedProd, previousIndex);
         }
       });
     }
   }
 
   updateBoxNumber(productdto: Productdto, editedBoxNumber: string | undefined) {
    if(productdto && productdto.serialNumber && editedBoxNumber) {
      const updateProductdto: Productdto = {
        serialNumber: productdto.serialNumber,
        boxNumber: editedBoxNumber
      }
      if(updateProductdto.serialNumber) {
      this.stockservice.updateProduct(updateProductdto.serialNumber, updateProductdto).subscribe(
        (response) => {
          console.log('Product Updated successfully:', response);
        },
        (error) => {
          console.error('Failed to add stock:', error);
        }
      );
     }
  
    }
  }
  
    navigateToAssignProduct() {
      const serialNumbersArray = Array.from(this.selectedSerialNumbers);
      this.dataSharingService.updatecheckedBoxProds(serialNumbersArray);
      this.router.navigate(['/assignproducts'], { queryParams: { id: this.stockreference } });     
         
    }

    confirmManagerDeletion(prod: Productdto): void {
      const message = 'Are you sure you want to detach : ' + prod.managerProd?.firstname + ' ' + prod.managerProd?.lastname + ' From the product : '
      + prod.serialNumber;
      const confirmation = confirm(message);
      if (confirmation) {
        this.deleteManager(prod);
      }
    }
    confirmAgentDeletion(prod: Productdto): void {
      const message = 'Are you sure you want to detach : ' + prod.agentProd?.firstname + ' ' + prod.agentProd?.lastname + ' From the product : '
      + prod.serialNumber;
      const confirmation = confirm(message);
      if (confirmation) {
        this.deleteAgent(prod);
      }
    }
    deleteManager(prod: Productdto): void {
      if (prod.serialNumber) {
      this.stockservice.detachManagerFromProduct(prod.serialNumber).subscribe(
        () => {
          console.log('Manager deleted successfully.');
          const productIndex = this.filterfinishforProds.findIndex(product => product.serialNumber === prod.serialNumber);
          if (productIndex !== -1) {
            this.filterfinishforProds[productIndex].managerProd = undefined;
          }
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
      }

    }
    deleteAgent(prod: Productdto): void {
      if (prod.serialNumber) {
      this.stockservice.detachAgentFromProduct(prod.serialNumber).subscribe(
        () => {
          console.log('Agent deleted successfully.');
          const productIndex = this.filterfinishforProds.findIndex(product => product.serialNumber === prod.serialNumber);
          if (productIndex !== -1) {
            this.filterfinishforProds[productIndex].agentProd = undefined;
          }
          },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
      }
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
      this.getReturnedProductsByStockReference(this.stockreference, 0, this.searchTerm);
    }


    loadingSold: boolean = true;
    emptySoldProducts: boolean = true;
    totalPagesSoldProd: number = 0;
    totalElementsSoldProd: number = 0;
    currentPageSoldProd: number = 0;
    filterfinishforSoldProds: SoldProductDto[] = [];
    pagedsoldProducts: SoldProductDto[][] = [];
  
    getSoldProductsByStockReference(ref: string, page: number, search: string) {
      this.loading = true;
      try {
        this.stockservice.getSoldProductsPaginatedByStockReference(ref, page, this.pageSize, search)
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
        this.getSoldProductsByStockReference(this.stockreference, newPage - 1, this.searchTerm);
    } 
 
    
    onFileSelectForSell(event: any): void {
      const fileInput = event.target as HTMLInputElement;
      const file: File = event.target.files[0] as File;
      const allowedExtensions = ['csv', 'xlsx'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if(this.selectedSheetIndexToenter != null) {
      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        if (fileExtension === 'xlsx') {
          this.convertExcelToCsv(file, this.selectedSheetIndexToenter);
        } else {
          this.selectedFile = file;
        }
      } else {
        console.error('Invalid file type. Please select a CSV or Excel file.');
      }
    } else {
      this.nonselectedSheetIndexToenter = true;
      fileInput.value = '';  
    }
      }
  
      uploadFileTocheckSell(): void {
        if (this.selectedFile) {
          this.loadingForUpload = true;
          this.stockservice.uploadcsvTocheckSell(this.selectedFile, this.stockreference).subscribe(
            result => {
              console.log(result);
              this.loadingForUpload = false;
              location.reload();

            },
            error => {
              console.error('Error uploading file:', error);
              this.loadingForUpload = false;
            }
          ); 
        } else {
          console.error('No file selected.');
          this.loadingForUpload = false;
        }
      }
  



      returnloading: boolean = true;
      emptyReturnProducts: boolean = true;
      totalReturnPages: number = 0;
      totalReturnlements: number = 0;  
      currentReturnPage: number = 0;
      returnProds: Productdto[] = [];
      pagedReturnProducts: Productdto[][] = [];
    
      
      getReturnedProductsByStockReference(ref: string, page: number, search: string) {
        this.returnloading = true;
        try {
          this.stockservice.getReturnedProductsPaginatedByStockReference(ref, page, this.pageSize, search)
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
      this.getReturnedProductsByStockReference(this.stockreference, newPage - 1, this.searchTerm);
  } 
 
  
 

  confirmProductDeletion(product: Productdto): void {
    const message = 'Are you sure you want to delete the product: "' + product?.serialNumber+ '"';
    
    const dialogRef = this.dialog.open(ConfiramtionDialogComponent, {
      data: { message, onConfirm: () => this.deleteProduct(product, dialogRef) }
    });
    dialogRef.componentInstance.onCancel.subscribe(() => {
      dialogRef.close();
    });
  }


  confirmReturnProductDeletion(product: Productdto): void {
    const message = 'Are you sure you want to delete the returned product: "' + product?.serialNumber+ '"';
    
    const dialogRef = this.dialog.open(ConfiramtionDialogComponent, {
      data: { message, onConfirm: () => this.deleteProduct(product, dialogRef) }
    });
    dialogRef.componentInstance.onCancel.subscribe(() => {
      dialogRef.close();
    });
  }
 

  deleteProduct(prod : Productdto , dialogRef: MatDialogRef<ConfiramtionDialogComponent>): void {
    if(prod.serialNumber){
    this.stockservice.deleteProduct(prod.serialNumber).subscribe(
      () => {
        console.log('product deleted successfully.');
        this.getProductsByStockReference(this.stockreference, 0, "");
        this.getReturnedProductsByStockReference(this.stockreference, 0, "");
        dialogRef.close();
      },
      (error) => {
        console.error('Error deleting product:', error);
      }
    );}
  }


  confirmSoldProductDeletion(soldProduct: SoldProductDto): void {
    const message = 'Are you sure you want to delete the sold product: "' + soldProduct?.serialNumber + '"';
    
    const dialogRef = this.dialog.open(ConfiramtionDialogComponent, {
      data: { message, onConfirm: () => this.deleteSoldProduct(soldProduct, dialogRef) }
    });
    dialogRef.componentInstance.onCancel.subscribe(() => {
      dialogRef.close();
    });
  }


  deleteSoldProduct(soldProd: SoldProductDto, dialogRef: MatDialogRef<ConfiramtionDialogComponent>): void {
    if(soldProd.serialNumber){
    this.stockservice.deleteSoldProduct(soldProd.serialNumber).subscribe(
      () => {
        console.log('soldProd deleted successfully.');
        this.getSoldProductsByStockReference(this.stockreference, 0, ""); 
        dialogRef.close();

      },
      (error) => {
        console.error('Error deleting soldProd:', error);
      }
    );
  }
  }

  navigateToCheckHistory(ref?: string) {
    if (ref === undefined) {
      console.log('Invalid ref');
      return;
    }
   this.router.navigate(['/checkhistory'], { queryParams: { id: ref } });     
  }

}
    
