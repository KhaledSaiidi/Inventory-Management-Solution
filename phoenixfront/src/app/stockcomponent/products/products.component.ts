import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private stockservice: StockService) {}
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
    this.getProductsByStockReference(this.stockreference);
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
  productsDto: Productdto[] = [];
  getProductsByStockReference(ref : string){
    this.stockservice.getProductsByStockReference(ref).subscribe(
      (data) => {
    this.productsDto = data as Productdto[];
      },
      (error) => {
        console.error('Failed to get products:', error);
      }
    );
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
  

}
