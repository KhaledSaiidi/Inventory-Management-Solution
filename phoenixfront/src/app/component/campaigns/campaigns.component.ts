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
  selectedRowIndex: number | null = null;

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

  
  navigateToClient(companyName: string | undefined): void {
    if (companyName) {
      this.router.navigate(['/client', { companyName: companyName }]);
    }
  }
  isDescriptionVisible = false;

  enable: boolean = false;
  campaigndto?: Campaigndto;
  showTooltip(campaigndto: Campaigndto) {
    this.enable=true;
      this.campaigndto = campaigndto;
  }
  hideTooltip() {
    this.enable=false;
   }
 
}
