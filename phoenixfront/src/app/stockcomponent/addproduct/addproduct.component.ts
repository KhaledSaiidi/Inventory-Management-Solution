import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit{
  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder) {}
    
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
        productType: [''],
        productName: [''],
        price: [''],
        productDescription: ['']
      });
    }
    onSubmit(){
  
    }
  
  
}
