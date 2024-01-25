import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Productdto } from 'src/app/models/inventory/ProductDto';
import { Stockdto } from 'src/app/models/inventory/Stock';
import { StockService } from 'src/app/services/stock.service';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-stockinfo',
  templateUrl: './stockinfo.component.html',
  styleUrls: ['./stockinfo.component.css']
})
export class StockinfoComponent implements OnInit{
  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private stockservice: StockService) {}
    navigateToStock(){
      this.router.navigate(['/stock']);
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
      this.getProdsbyStockRef(this.stockreference);
    }


    stockdto!: Stockdto;
    products!: string[];
    campaignName!: string;
    companyName!: string;
    stockValue!: number;
    stockDate!: Date;
    notes!: string;
    getStockbyRef(ref : string){
      this.stockservice.getStockByreference(ref).subscribe(
        (data) => {
      this.stockdto = data as Stockdto;
      if(this.stockdto.campaigndto?.campaignName && this.stockdto.campaigndto?.client?.companyName) {
       this.campaignName = this.stockdto.campaigndto?.campaignName
       this.companyName = this.stockdto.campaigndto?.client?.companyName
      }
      if(this.stockdto.productTypes) {
      this.products = this.stockdto.productTypes;
        }
      if(this.stockdto.stockDate) {
        this.stockDate = this.stockdto.stockDate;
        }
      if(this.stockdto.stockValue) {
        this.stockValue = this.stockdto.stockValue;
        }
      if(this.stockdto.notes) {
        this.notes = this.stockdto.notes;
        }
        },
        (error) => {
          console.error('Failed to get stock:', error);
        }
      );
    }

    productsDto!: Productdto[];
    uniqueProductMap: Map<string, { prodName: string, brand: string, price: number, count: number }> = new Map();
    uniqueProducts: Array<{ prodName: string, brand: string, price: number, count: number }> = [];

    getProdsbyStockRef(ref : string){
      this.stockservice.getProductsByStockReference(ref).subscribe(
        (data) => {
          this.productsDto = data as Productdto[];
          this.productsDto.forEach(product => {
            this.updateUniqueProductMap(product);
          });
           this.uniqueProducts = Array.from(this.uniqueProductMap.values());
           console.log(this.uniqueProducts);
        },
        (error) => {
          console.error('Failed to get prods:', error);
        }
      );
    }

    private updateUniqueProductMap(product: Productdto): void {
      const prodName = product.prodName?.toLowerCase();
      const brand = product.brand?.toLowerCase();
      const price = product.price;
      if (!prodName || !brand || !price) {
        return;
      }        
      const key = `${prodName}-${brand}`;
      const existingProduct = this.uniqueProductMap.get(key);
  
      if (existingProduct) {
        existingProduct.count++;
      } else {
        this.uniqueProductMap.set(key, { prodName, brand, price, count: 1 });
      }
    }

    downloadPdf() {
      const originalElement = document.getElementById('pdf-content');
      if(originalElement) {
      const clonedElement = originalElement.cloneNode(true) as HTMLElement;
      const tableElement = clonedElement.querySelector('.table') as HTMLElement;
       if(tableElement) {
        tableElement.style.maxHeight = 'unset';
        tableElement.style.overflowY = 'unset';
      }
      
      const options = {
        filename: "Stock" + " " + this.campaignName + " " + "info",
         pagebreak: { avoid: '.avoid-page-break' }
      };
      html2pdf().from(clonedElement).set(options).save();
    }
      
    }
  

}
