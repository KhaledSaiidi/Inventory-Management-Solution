import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addteam',
  templateUrl: './addteam.component.html',
  styleUrls: ['./addteam.component.css']
})
export class AddteamComponent implements OnInit{
  constructor(private router: Router) {}
  selectedImage: File | null = null;

  navigateToAppagents(){
    this.router.navigate(['/agents']);
  }

  public ngOnInit(): void {
  }

  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
    }
  }
}
