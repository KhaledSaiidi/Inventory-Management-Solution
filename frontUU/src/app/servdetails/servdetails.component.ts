import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-servdetails',
  templateUrl: './servdetails.component.html',
  styleUrls: ['./servdetails.component.css']
})
export class ServdetailsComponent implements OnInit {
  constructor(private route: ActivatedRoute) { }
  selectedTab!: number;
  ngOnInit(): void {
    const selectedTabParam = this.route.snapshot.paramMap.get('selectedTab');
    this.selectedTab = selectedTabParam ? parseInt(selectedTabParam, 10) : 0;

  }

  selectTab(tabNumber: number): void {
    this.selectedTab = tabNumber;
  }


}
