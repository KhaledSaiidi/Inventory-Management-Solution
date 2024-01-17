import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit{
  constructor(private router: Router) {}
  
  ngOnInit(): void{
    }

  ref: string = 'khaled';
  navigateToProducts(ref?: string) {
    if (ref === undefined) {
      console.log('Invalid ref');
      return;
    }
    this.router.navigate(['/products'], { queryParams: { id: ref } });     
    console.log(ref);
  }

}
