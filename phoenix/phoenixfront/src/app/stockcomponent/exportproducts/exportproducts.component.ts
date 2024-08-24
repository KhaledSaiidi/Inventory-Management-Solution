import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Productdto } from 'src/app/models/inventory/ProductDto';
import { StockService } from 'src/app/services/stock.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
@Component({
  selector: 'app-exportproducts',
  templateUrl: './exportproducts.component.html',
  styleUrls: ['./exportproducts.component.css']
})
export class ExportproductsComponent implements OnInit{

  constructor( 
    private router: Router, private stockservice: StockService) {}

  ngOnInit(): void {}

  products: any[] = [{ id: 1, isChecked: false }];
  productValues: string[] = [];

  searchStart: boolean = true;
  addProduct() {
    const id = this.products.length + 1;
    this.products.push({ id, isChecked: false });
  }
  removeProductsAfter(index: number) {
    this.products.splice(index + 1);
    this.productValues.splice(index + 1);
  }
  updateProductValue(index: number, event: any) {
    if (event && 'value' in event.target) {
      this.productValues[index] = event.target.value;
    }
    }

    onCheckboxChange(checkbox: HTMLInputElement, index: number) {
      if (checkbox.checked) {
        this.addProduct();
      }
      else {
        this.removeProductsAfter(index);
      }
  
    }
  
  navigateToProds() {
    this.router.navigate(['/navigateprods']);
  }

  productsToexport: Productdto[] = [];
  search() {
    this.productValues = Array.from(new Set(this.productValues));
    this.stockservice.getProductsToExport (this.productValues)
        .subscribe(
          (productsToexport: Productdto[]) => {
            this.productsToexport = productsToexport;
            this.searchStart = false;
          },
          (error) => {
            console.error('Error fetching productsToexport:', error);
            this.searchStart = false;
          }
        );
  }
  

  exportToExcel(): void {
    const filteredProducts = this.productsToexport.map(product => ({
      ESN: product.serialNumber,
      SIM: product.simNumber,
      stock: product.stock ? `${product.stock.stockReference || ''} ${product.stock.notes || ''}` : 'N/A',
      BOX: product.boxNumber,
      productType: product.productType,
      comments: product.comments,
      price: product.price,
      checkout: product.checkout ? this.formatDate(product.checkout) : 'N/A',
      checkin: product.checkin ? this.formatDate(product.checkin) : 'N/A',
      'Agent Associated': product.agentProd ? `${product.agentProd.username?.toUpperCase() || ''} ${product.agentProd.lastname?.toUpperCase() || ''}` : 'N/A',
      'Senior Advisor': product.managerProd ? `${product.managerProd.username?.toUpperCase() || ''} ${product.managerProd.lastname?.toUpperCase() || ''}` : 'N/A',
      'Agent Sold': product.agentwhoSoldProd ? `${product.agentwhoSoldProd.username?.toUpperCase() || ''} ${product.agentwhoSoldProd.lastname?.toUpperCase() || ''}` : 'N/A',
      'Agent Returned': product.agentReturnedProd ? `${product.agentReturnedProd.username?.toUpperCase() || ''} ${product.agentReturnedProd.lastname?.toUpperCase() || ''}` : 'N/A'
    }));
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredProducts);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    
    saveAs(data, 'productsExported.xlsx');
  }
  
  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
  }
   

}
