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
  getStockbyRef(ref : string){
    this.stockservice.getStockByreference(ref).subscribe(
      (data) => {
    this.stockdto = data as Stockdto;
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

  getStateText(state: State | undefined): string {
    switch (state) {
      case State.soldProd:
        return 'Sold';
      case State.notSoldProd:
        return 'Not sold';
      case State.returnedProd:
        return 'Returned';
      default:
        return 'Unknown state';
    }
  }



}
