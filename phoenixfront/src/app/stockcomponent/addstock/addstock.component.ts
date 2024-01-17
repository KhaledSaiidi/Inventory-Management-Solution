import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Campaigndto } from 'src/app/models/agents/Campaigndto';
import { AgentsService } from 'src/app/services/agents.service';

@Component({
  selector: 'app-addstock',
  templateUrl: './addstock.component.html',
  styleUrls: ['./addstock.component.css']
})
export class AddstockComponent {
  constructor(private router: Router, private agentsService: AgentsService) {}

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
}
