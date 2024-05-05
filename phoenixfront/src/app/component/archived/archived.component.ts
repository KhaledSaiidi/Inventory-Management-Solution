import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Campaigndto } from 'src/app/models/agents/Campaigndto';
import { AgentsService } from 'src/app/services/agents.service';

@Component({
  selector: 'app-archived',
  templateUrl: './archived.component.html',
  styleUrls: ['./archived.component.css']
})
export class ArchivedComponent implements OnInit {
  constructor(private agentsService: AgentsService,private router: Router) {}
  selectedRowIndex: number | null = null;

  campaigns: Campaigndto[] = [];
  ngOnInit(): void {
      this.getArchivedcampaigns();
  }
  getArchivedcampaigns(){
    this.agentsService.getArchivedCampaigns().subscribe(
      (data) => {
    this.campaigns = data as Campaigndto[];
    console.log(this.campaigns);
      },
      (error) => {
        console.error('Failed to add team:', error);
      }
    );
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

   deleteArchivedcampaigns(campaignref: string | undefined){
    if(campaignref) {
    this.agentsService.deleteArchiveCampaign(campaignref).subscribe(
      () => {
        console.log('Archived Campaign deleted successfully.');
        this.getArchivedcampaigns();
      },
      (error) => {
        console.error('Error deleting Archive Campaign:', error);
      }
      );
    }
  }

  navigateToStockInfo(ref?: string) {
    if (ref === undefined) {
      console.log('Invalid ref');
      return;
    }
    this.router.navigate(['/stockarchive'], { queryParams: { id: ref } });
    console.log(ref);
  }
}
