import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  navigateToAllNews(): void {
    this.router.navigate(['/allnews']);
  }

gift: string = "Gift";
casino: string = "casino";
awards: string = "awards";
fire: string = "fire";
  navigateToNewsdetails(id: string): void {
    console.log('Navigating to:', id);
    this.router.navigate(['/newsdetails', id]);
  }
  
}
