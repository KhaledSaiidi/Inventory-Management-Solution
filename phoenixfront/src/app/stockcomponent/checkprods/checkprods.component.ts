import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Productdto } from 'src/app/models/inventory/ProductDto';
import { DataSharingService } from 'src/app/services/dataSharing.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-checkprods',
  templateUrl: './checkprods.component.html',
  styleUrls: ['./checkprods.component.css']
})
export class CheckprodsComponent implements OnInit{
  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private dataSharingService: DataSharingService,
    private stockservice: StockService) {}
    stockreference: string = '';
    
    compuncheckedProds: string[] = [];
    ngOnInit(): void {
      this.route.queryParamMap.subscribe(params => {
        const id = params.get('id');
        if(id != null){
        this.stockreference = id;
        console.log(this.stockreference);
        }
      }); 
      this.dataSharingService.uncheckedProds$.subscribe(uncheckedProds => {
        this.compuncheckedProds = uncheckedProds;
        console.log(this.compuncheckedProds);
            });
    this.getProductsByStockReference(this.stockreference);
    }
    navigateToProducts(ref?: string) {
      if (ref === undefined) {
        console.log('Invalid ref');
        return;
      }
      this.router.navigate(['/products'], { queryParams: { id: ref } });     
      console.log(ref);
    }
    productsDto: Productdto[] = [];
    getProductsByStockReference(ref : string){
      this.stockservice.getProductsByStockReference(ref).subscribe(
        (data) => {
          this.productsDto = (data as Productdto[]).filter(product => !product.checked);
        },
        (error) => {
          console.error('Failed to get products:', error);
        }
      );
    }
  



}
