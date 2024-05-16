import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfiramtionDialogComponent } from 'src/app/design-component/confiramtion-dialog/confiramtion-dialog.component';
import { Campaigndto } from 'src/app/models/agents/Campaigndto';
import { AgentsService } from 'src/app/services/agents.service';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-archived',
  templateUrl: './archived.component.html',
  styleUrls: ['./archived.component.css']
})
export class ArchivedComponent implements OnInit {
  constructor(private agentsService: AgentsService,private router: Router,
    private dialog: MatDialog, private securityService: SecurityService
  ) {}
  selectedRowIndex: number | null = null;
  isManager: boolean = this.securityService.hasRoleIn(['MANAGER', 'IMANAGER']);

  campaigns: Campaigndto[] = [];

  loading: boolean = true;
  emptyCamp: boolean = true;

  ngOnInit(): void {
      this.getArchivedcampaigns();
  }
  getArchivedcampaigns(){
    this.loading = true;
    this.emptyCamp = true;
  
    this.agentsService.getArchivedCampaigns().subscribe(
      (data) => {
    this.campaigns = data as Campaigndto[];
    console.log(this.campaigns);
    this.loading = false;
    if(this.campaigns && this.campaigns.length > 0){
      this.emptyCamp = false;
    }
      },
      (error) => {
        console.error('Failed to add team:', error);
        this.loading = false;
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


   confirmArchiveDeletion(campaignref: string | undefined): void {
    const message = 'Are you sure you want to delete the entire Campaign Archive: "' + campaignref 
    + '"?\n All stocks and products archived inside will be deleted.';
    
    const dialogRef = this.dialog.open(ConfiramtionDialogComponent, {
      data: { message, onConfirm: () => this.deleteArchivedcampaigns(campaignref, dialogRef) }
    });

    dialogRef.componentInstance.onCancel.subscribe(() => {
      dialogRef.close();
    });
  }

   deleteArchivedcampaigns(campaignref: string | undefined, dialogRef: MatDialogRef<ConfiramtionDialogComponent>){
    if(campaignref) {
    this.agentsService.deleteArchiveCampaign(campaignref).subscribe(
      () => {
        console.log('Archived Campaign deleted successfully.');
        dialogRef.close();
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
