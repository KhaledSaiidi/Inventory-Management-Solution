import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Productdto } from 'src/app/models/inventory/ProductDto';
import { State } from 'src/app/models/inventory/State';
import { Stockdto } from 'src/app/models/inventory/Stock';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-updateprod',
  templateUrl: './updateprod.component.html',
  styleUrls: ['./updateprod.component.css']
})
export class UpdateprodComponent implements OnInit{
  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private stockservice: StockService) {}
    stockreference: string = '';
    serialNumber: string = '';
    ngOnInit(): void {
      this.route.queryParamMap.subscribe(params => {
        const id = params.get('id');
        const prodId = params.get('prodId');
        if(id !== null && prodId !== null){
          this.stockreference = id;
          this.serialNumber = prodId;
          console.log(this.stockreference, this.serialNumber);
        }
      }); 
      this.initializeForm();
      this.getProductWithSerialNumber(this.serialNumber);
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
    
    product!: Productdto;
    productType!: string;
    getProductWithSerialNumber(id: string){
      this.stockservice.getProductByserialNumber(id).subscribe(
        (data) => {
        this.product = data as Productdto;
        if(this.product.productType)
        this.productType = this.product.productType;
        this.prodForm.patchValue({
          productType: this.product.productType,
          productName: this.product.prodName,
          price: this.product.price,
          productDescription: this.product.prodDescription,
          brand: this.product.brand
        });
  
        console.log(this.product);
        },
        (error) => {
          console.error('Failed to get Product:', error);
        }
      );
    }

    products!: string[];
    stockdto!: Stockdto;
    getStockbyRef(ref : string){
      this.stockservice.getStockByreference(ref).subscribe(
        (data) => {
      this.stockdto = data as Stockdto;
      console.log(this.stockdto);
      if(this.stockdto.productTypes) {  
        this.products = this.stockdto.productTypes.filter(prodType => prodType !== this.productType);
      }
        },
        (error) => {
          console.error('Failed to get stock:', error);
        }
      );
    }
    prodForm!: FormGroup;
    initializeForm() {
      this.prodForm = this.fb.group({
        productType: [''],
        productName: [''],
        price: [''],
        productDescription: [''],
        brand: ['']
      });
    }

    onSubmit() {
      const productdto: Productdto = {
        productType: this.prodForm.get('productType')?.value,
        prodName: this.prodForm.get('productName')?.value,
        prodDescription: this.prodForm.get('productDescription')?.value,
        price: this.prodForm.get('price')?.value,
        brand: this.prodForm.get('brand')?.value
      }
      console.log(productdto);
      this.stockservice.updateProduct(this.serialNumber, productdto).subscribe(
        (response) => {
          console.log('Product Updated successfully:', response);
          this.prodForm.reset();
          this.navigateToProducts(this.stockreference);
        },
        (error) => {
          console.error('Failed to add stock:', error);
        }
      );
    }
  
}
