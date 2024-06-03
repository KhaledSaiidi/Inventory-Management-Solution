import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfiramtionDialogComponent } from 'src/app/design-component/confiramtion-dialog/confiramtion-dialog.component';
import { Campaigndto } from 'src/app/models/agents/Campaigndto';
import { AgentsService } from 'src/app/services/agents.service';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {
  constructor(private agentsService: AgentsService,private router: Router,
    private dialog: MatDialog, private securityService: SecurityService
  ) {}
  selectedRowIndex: number | null = null;
  isManager: boolean = this.securityService.hasRoleIn(['MANAGER', 'IMANAGER']);
  campaigns: Campaigndto[] = [];
  ngOnInit(): void {
      this.getcampaigns();
  }

  loading: boolean = true;
  emptyCampaigns: boolean = true;
  getcampaigns(){
    this.agentsService.getCampaigns().subscribe(
      (data) => {
    this.campaigns = data as Campaigndto[];
    this.loading = false;
    if(this.campaigns.length > 0){
      this.emptyCampaigns = false;
      console.log("emptyStock: " + this.emptyCampaigns);
    }
      },
      (error) => {
        console.error('Failed to add team:', error);
        this.loading = false;
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
 
   navigateToCampaign(reference: string | undefined): void {
    if (reference) {
      this.router.navigate(['/updatecamapign', { reference: reference }]);
    }
  }
  confirmDeletion(campreference: string | undefined): void {
    if(campreference) {
    const message = 'Are you sure you want to Archive the entire Campaign: "' + campreference 
    + '"?\n All Stocks and products inside will be archived in a read-only mode.';
    
    const dialogRef = this.dialog.open(ConfiramtionDialogComponent, {
      data: { message, onConfirm: () => this.archiveCampaign(campreference, dialogRef) }
    });

    dialogRef.componentInstance.onCancel.subscribe(() => {
      dialogRef.close();
    });

    }
  }



  archiveCampaign(campreference: string, dialogRef: MatDialogRef<ConfiramtionDialogComponent>): void {
    this.agentsService.archiveCampaign(campreference).subscribe(
      () => {
        this.getcampaigns();
        dialogRef.close();
      },
      (error) => {
        console.error('Error deleting campaign:', error);
      }
    ); 
  }
}
