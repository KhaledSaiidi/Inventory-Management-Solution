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
      this.router.navigate(['/stocks']);
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
      this.getProductInfo(this.stockreference);
      this.getSoldProductInfo(this.stockreference);
    }


    stockdto!: Stockdto;
    products!: string[];
    campaignName!: string;
    companyName!: string;
    stockValue!: number;
    shippingDate!: Date;
    receivedDate!: Date;
    dueDate!: Date;

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
      if(this.stockdto.shippingDate) {
        this.shippingDate = this.stockdto.shippingDate;
        }
        if(this.stockdto.receivedDate) {
          this.receivedDate = this.stockdto.receivedDate;
          }
          if(this.stockdto.dueDate) {
            this.dueDate = this.stockdto.dueDate;
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


    prods: number = 0;
    checked: number = 0;
    returned: number = 0;
  
    sold: number = 0;
    getProductInfo(stockReference: string): void {
      this.stockservice.getProductsInfo(stockReference).subscribe(data => {
        this.prods = data.prods;
        this.checked = data.checked;
        this.returned = data.returned;
      });
    }

    getSoldProductInfo(stockReference: string): void {
      this.stockservice.getSoldProductsInfo(stockReference).subscribe(data => {
        this.sold = data.prods;
      });
    }

  
  

}
