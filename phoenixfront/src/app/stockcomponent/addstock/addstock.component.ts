import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addstock',
  templateUrl: './addstock.component.html',
  styleUrls: ['./addstock.component.css']
})
export class AddstockComponent {
  constructor(private router: Router) {}

  navigateToStock(){
    this.router.navigate(['/stock']);
  }
}
