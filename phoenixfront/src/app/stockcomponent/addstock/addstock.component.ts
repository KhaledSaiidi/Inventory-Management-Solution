import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Campaigndto } from 'src/app/models/agents/Campaigndto';
import { AgentsService } from 'src/app/services/agents.service';

@Component({
  selector: 'app-addstock',
  templateUrl: './addstock.component.html',
  styleUrls: ['./addstock.component.css']
})
export class AddstockComponent implements OnInit{
  constructor(private router: Router, private agentsService: AgentsService, private fb: FormBuilder) {}

  navigateToStock(){
    this.router.navigate(['/stock']);
  }

  campaigns: Campaigndto[] = [];
  getcampaigns(){
    this.agentsService.getCampaigns().subscribe(
      (data) => {
    this.campaigns = data as Campaigndto[];
    console.log(this.campaigns);
      },
      (error) => {
        console.error('Failed to get campaigns:', error);
      }
    );
  }

  ngOnInit(): void {
    this.initializeForm();
  }
  stockForm!: FormGroup;
  initializeForm() {
    this.stockForm = this.fb.group({
      reference: [''],
      stockDate: [null],
      notes: ['']
    });
  }
  onSubmit(){

  }
}
