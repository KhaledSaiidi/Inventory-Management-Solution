import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Campaigndto } from 'src/app/models/agents/Campaigndto';
import { AgentsService } from 'src/app/services/agents.service';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {
  constructor(private agentsService: AgentsService,private router: Router) {}
  
  campaigns: Campaigndto[] = [];
  ngOnInit(): void {
      this.getcampaigns();
  }


  getcampaigns(){
    this.agentsService.getCampaigns().subscribe(
      (data) => {
    this.campaigns = data as Campaigndto[];
    console.log(this.campaigns);
      },
      (error) => {
        console.error('Failed to add team:', error);
      }
    );
  }

  navigateToaddClient(){
    this.router.navigate(['/addclient']);      
  }

  navigateToaddCampaign(){
    this.router.navigate(['/addcampaign']);      
  }

}
