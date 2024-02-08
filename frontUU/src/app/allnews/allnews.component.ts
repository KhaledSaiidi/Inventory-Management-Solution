import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-allnews',
  templateUrl: './allnews.component.html',
  styleUrls: ['./allnews.component.css']
})
export class AllnewsComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
 

  gift: string = "Gift";
  casino: string = "casino";
  awards: string = "awards";
  fire: string = "fire";
  dreams: string = "dreams";
  bobbyfam: string = "bobbyfam";
  summit: string = "summit";
  navigateToNewsdetails(id: string): void {
    console.log('Navigating to:', id);
    this.router.navigate(['/newsdetails', id]);
  }
}
