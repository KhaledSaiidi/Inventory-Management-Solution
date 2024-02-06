import {  ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  forkJoin } from 'rxjs';
import { Productdto } from 'src/app/models/inventory/ProductDto';
import { State } from 'src/app/models/inventory/State';
import { Stockdto } from 'src/app/models/inventory/Stock';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private stockservice: StockService,
    private cdRef: ChangeDetectorRef ) {}
    enable: boolean = false;
    productdto?: Productdto;  
    selectedRowIndex: number | null = null;
    showTooltip(productdto: Productdto) {
      this.enable=true;
        this.productdto = productdto;
    }
    hideTooltip() {
      this.enable=false;
     }
  
  stockreference: string = '';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if(id != null){
      this.stockreference = id;
      console.log(this.stockreference);
      }
    }); 
    this.getStockbyRef(this.stockreference);
    this.getProductsByStockReference(this.stockreference,0);

  }
  navigateToAddProduct(ref?: string) {
    if (ref === undefined) {
      console.log('Invalid ref');
      return;
    }
   this.router.navigate(['/addproduct'], { queryParams: { id: ref } });     
   console.log(ref);
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
  state!: State;
  loading: boolean = true;
  emptyProducts: boolean = true;
  totalPages: number = 0;
  totalElements: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  filterfinishforProds: Productdto[] = [];
  pagedProducts: Productdto[][] = [];
  searchTerm: string = '';

  getProductsByStockReference(ref: string, page: number) {
    this.loading = true;
    this.stockservice.getProductsPaginatedByStockReference(ref, page, this.pageSize).subscribe(
      (data) => {
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.currentPage = data.number + 1;
        this.loading = false;
        this.filterfinishforProds = data.content;
        this.checkAndSetEmptyProducts();
     },
      (error) => {
        console.error('Failed to get products:', error);
        this.loading = false;
          }
    );
  }    

private checkAndSetEmptyProducts() {
  if(this.filterfinishforProds && this.filterfinishforProds.length > 0) {
    this.emptyProducts = false;
  } else {
    this.emptyProducts = true;
  }
}

  
  
  onPageChange(newPage: number): void {
    this.getProductsByStockReference(this.stockreference, newPage - 1);
  }
        

  getStateText(state: string): string {
    switch (state) {
      case 'soldProd':
        return 'Sold';
      case 'notSoldProd':
        return 'Not sold';
      case 'returnedProd':
        return 'Returned';
      default:
        return 'Unknown';
    }
  }

  navigateToUpdateProduct(ref1?: string, ref2?: string) {
    if (ref1 === undefined || ref2 === undefined) {
      console.log('Invalid refs');
      return;
    }
    this.router.navigate(['/updateproduct'], { queryParams: { id: ref1, prodId: ref2 } });
    console.log(ref1, ref2);
  }
  
  selectedFile: File | null = null;
  selectedSheetIndex: number = 0;
  selectedSheetIndexToenter: number = 0;
  updateSheetIndex(): void {
    this.selectedSheetIndexToenter = Math.max(0, this.selectedSheetIndex - 1);
    console.log(this.selectedSheetIndex);
    console.log(this.selectedSheetIndexToenter);

  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0] as File;
    const allowedExtensions = ['csv', 'xlsx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension && allowedExtensions.includes(fileExtension)) {
      if (fileExtension === 'xlsx') {
        this.convertExcelToCsv(file, this.selectedSheetIndexToenter);
      } else {
        this.selectedFile = file;
      }
    } else {
      console.error('Invalid file type. Please select a CSV or Excel file.');
    }
    }
    convertExcelToCsv(excelFile: File, selectedSheetIndex: number){
      this.stockservice.excelToCsv(excelFile, selectedSheetIndex).subscribe(
        (csvFile: File) => {
          this.selectedFile = csvFile;
          console.log('Excel file converted to CSV.');
        },
        error => {
          console.error('Error converting Excel to CSV:', error);
        }
      );
    }

    uploadFile(): void {
      if (this.selectedFile) {
        this.stockservice.addProdbyuploadFile(this.selectedFile, this.stockreference).subscribe(
          result => {
            location.reload();
          },
          error => {
            console.error('Error uploading file:', error);
          }
        );
      } else {
        console.error('No file selected.');
      }
  
    }
        
 /* uncheckedProds!: string[];
  uploadFile(): void {
    if (this.selectedFile) {
      this.stockservice.uploadFile(this.selectedFile, this.stockreference).subscribe(
        result => {
          this.uncheckedProds = result as string[];
          console.log(this.uncheckedProds);
          this.dataSharingService.updateUncheckedProds(this.uncheckedProds);
          this.navigateToCheckProds(this.stockreference);
        },
        error => {
          console.error('Error uploading file:', error);
        }
      );
    } else {
      console.error('No file selected.');
    }
  } */

  navigateToCheckProds(ref?: string) {
    if (ref === undefined) {
      console.log('Invalid ref');
      return;
    }
    this.router.navigate(['/checkprods'], { queryParams: { id: ref } });     
    console.log(ref);
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
      const observables = [];
  
      for (let page = 0; page < this.totalPages; page++) {
        observables.push(
          this.stockservice.getProductsPaginatedByStockReference(this.stockreference, page, 20)
        );
      }
  
      forkJoin(observables).subscribe(
        (responses) => {
          responses.forEach((data) => {
            const slectedProds: Productdto[] = data.content;
            slectedProds.forEach((prod) => {
              this.selectedSerialNumbers.add(prod.serialNumber as string);
            });
          });
        },
        (error) => {
          console.error('Failed to get products:', error);
        }
      );

    }
    if (!this.selectAllChecked) {
      this.selectedSerialNumbers.clear();
    }

    
  }
  
  isEditMode = false;
  selectedProd: Productdto | null = null;
  editedBoxNumber: string | undefined;
  @ViewChild('editedBoxNumberInput', { static: false }) editedBoxNumberInputs!: ElementRef[];


  enableEditMode(prod: Productdto) {
    this.isEditMode = true;
    this.selectedProd = prod;
    this.editedBoxNumber = prod.boxNumber || undefined;
    const index = this.filterfinishforProds.indexOf(prod);
    const inputRef = this.editedBoxNumberInputs[index];

    setTimeout(() => {
      if (inputRef) {
        inputRef.nativeElement.focus();
      }
    });
    if (this.cdRef) {
      this.cdRef.detectChanges();
    }
  }
  disableEditMode() {
    this.isEditMode = false;
    if (this.selectedProd) {
      this.selectedProd.boxNumber = this.editedBoxNumber;
    }
    this.selectedProd = null;
    this.editedBoxNumber = undefined;
  }
    
      
  handleTabKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    event.preventDefault();
    if(this.selectedProd) {
    const currentIndex = this.filterfinishforProds.indexOf(this.selectedProd);
    const nextIndex = (currentIndex + 1) % this.filterfinishforProds.length; 
    this.selectedProd = this.filterfinishforProds[nextIndex];
    this.isEditMode = true;
    this.editedBoxNumber = this.selectedProd.boxNumber || undefined;
    const inputRef = this.editedBoxNumberInputs[nextIndex];
    setTimeout(() => {
      if (inputRef) {
        inputRef.nativeElement.focus();
      }
    });
    if (this.cdRef) {
      this.cdRef.detectChanges();
    }
    }
  }
  
}
    
