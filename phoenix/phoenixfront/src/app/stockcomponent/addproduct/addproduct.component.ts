import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Campaigndto } from 'src/app/models/agents/Campaigndto';
import { Productdto } from 'src/app/models/inventory/ProductDto';
import { Stockdto } from 'src/app/models/inventory/Stock';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit{
  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
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
      this.initializeForm();
      this.getStockbyRef(this.stockreference);
    }
   
    navigateToProducts(ref?: string) {
      if (ref === undefined) {
        console.log('Invalid ref');
        return;
      }
      this.router.navigate(['/products'], { queryParams: { id: ref } });     
      console.log(ref);
    }
    prodForm!: FormGroup;
    initializeForm() {
      this.prodForm = this.fb.group({
        serialNumber: [''],
        sim: [''],
        productType: [''],
        productName: [''],
        boxNumber: [''],
        price: [''],
        productDescription: ['']
      });
    }
    stockdto!: Stockdto;
    products!: string[];
    campaignName!: string;
    getStockbyRef(ref : string){
      this.stockservice.getStockByreference(ref).subscribe(
        (data) => {
      this.stockdto = data as Stockdto;
      if(this.stockdto.campaigndto?.campaignName) {
       this.campaignName = this.stockdto.campaigndto?.campaignName
      }
      if(this.stockdto.productTypes) {
      this.products = this.stockdto.productTypes;
      this.prodForm.patchValue({
        productType: this.products[0]
      });
        }
      console.log(this.stockdto);
        },
        (error) => {
          console.error('Failed to get stock:', error);
        }
      );
    }
    onSubmit(){
    const productdto: Productdto = {
      serialNumber: this.prodForm.get('serialNumber')?.value,
      simNumber: this.prodForm.get('sim')?.value,
      productType: this.prodForm.get('productType')?.value,
      prodName: this.prodForm.get('productName')?.value,
      price: this.prodForm.get('price')?.value,
      boxNumber: this.prodForm.get('boxNumber')?.value,
      comments: this.prodForm.get('productDescription')?.value,
      stock: this.stockdto
    }
    console.log(productdto);
    this.stockservice.addProduct(productdto).subscribe(
      (response) => {
        console.log('product added successfully:', response);
        this.prodForm.reset();
        this.navigateToProducts(this.stockreference);
      },
      (error) => {
        console.error('Failed to add product:', error);
      }
      );
    }
  
  
}