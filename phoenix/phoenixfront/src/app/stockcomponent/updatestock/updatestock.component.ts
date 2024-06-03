import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Campaigndto } from 'src/app/models/agents/Campaigndto';
import { Stockdto } from 'src/app/models/inventory/Stock';
import { AgentsService } from 'src/app/services/agents.service';
import { SecurityService } from 'src/app/services/security.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-updatestock',
  templateUrl: './updatestock.component.html',
  styleUrls: ['./updatestock.component.css']
})
export class UpdatestockComponent implements OnInit {
  constructor(private router: Router, private agentsService: AgentsService,
     private route: ActivatedRoute, private stockservice: StockService,
     private fb: FormBuilder, private agentservice: AgentsService,
     private securityService: SecurityService) {}
     isManager: boolean = this.securityService.hasRoleIn(['MANAGER', 'IMANAGER']);

       campaigns: Campaigndto[] = [];
       navigateToStock(){
         this.router.navigate(['/stocks']);
       }
       stockreference: string = '';
       ngOnInit(): void {
        this.route.queryParamMap.subscribe(params => {
          const id = params.get('id');
          if(id != null){
          this.stockreference = id;
          console.log(this.stockreference);
          }
        }); 
  
        this.initializeForm();
        this.getStockbyRef(this.stockreference);
      }  
      stockForm!: FormGroup;
      initializeForm() {
        this.stockForm = this.fb.group({
          reference: [''],
          shippingDate: [null],
          receivedDate: [null],
          notes: [''],
          checked: [false]
        });
      }


    
      getcampaigns(){
        this.agentsService.getCampaigns().subscribe(
          (data) => {
        this.campaigns = data as Campaigndto[];
        if (this.selectedcampaign) {
          this.campaigns = this.campaigns.filter(campaign => campaign.reference !== this.selectedcampaign.reference);
        }  
        console.log(this.campaigns);
          },
          (error) => {
            console.error('Failed to get campaign:', error);
          }
        );
      }
      stockdto!: Stockdto;
      stockIschecked: boolean = false;
      campaignref!: string;
      selectedcampaign!: Campaigndto;
      getStockbyRef(ref : string){
        this.stockservice.getStockByreference(ref).subscribe(
          (data) => {
        this.stockdto = data as Stockdto;
        if(this.stockdto.checked){
        this.stockIschecked = this.stockdto.checked;
      }
      if(this.stockdto.campaignRef){
        this.campaignref = this.stockdto.campaignRef;
        this.getcampaignbyreference(this.campaignref);
      }
        this.stockForm.patchValue({
          reference: this.stockdto.campaignRef,
          shippingDate: this.stockdto.shippingDate,
          receivedDate: this.stockdto.receivedDate,
          notes:this.stockdto.notes,
          checked: this.stockdto.checked
        });

          },
          (error) => {
            console.error('Failed to get stock:', error);
          }
        );
      }

      selectedCampaignrefernce!: string;
      selectedcampaignName!: string;
      selectedcampaignclientcompanyName!: string;
      getcampaignbyreference(reference : string){
        this.agentservice.getcampaignbyreference(reference).subscribe(
          (data) => {
        this.selectedcampaign = data as Campaigndto;
        if(this.selectedcampaign.reference) {
          this.selectedCampaignrefernce = this.selectedcampaign.reference;
        }
        if(this.selectedcampaign.campaignName) {
          this.selectedcampaignName = this.selectedcampaign.campaignName;
        }
        if(this.selectedcampaign.client?.companyName) {
          this.selectedcampaignclientcompanyName = this.selectedcampaign.client?.companyName;
        }

        this.getcampaigns();
          },
          (error) => {
            console.error('Failed to get camp:', error);
          }
        );
      }
    
    newproductTypes!: string[];
      onSubmit() {
        const stockDto: Stockdto = {
          campaignRef: this.stockForm.get('reference')?.value,
          shippingDate: this.stockForm.get('shippingDate')?.value,
          receivedDate: this.stockForm.get('receivedDate')?.value,
          notes: this.stockForm.get('notes')?.value,
          checked: this.stockForm.get('checked')?.value,
        }
        if (this.stockForm.get('reference')?.value) {
          this.agentservice.getcampaignbyreference(this.stockForm.get('reference')?.value).subscribe(
            (data) => {
              stockDto.campaigndto  = data as Campaigndto;
              if(stockDto.campaigndto.products){
              this.newproductTypes = stockDto.campaigndto.products;
              stockDto.productTypes = this.newproductTypes;
            }
            },
            (error) => {
              console.error('Failed to get camp:', error);
            }
          );
        }
        console.log(stockDto);
        this.stockservice.updateStock(this.stockreference, stockDto).subscribe(
          (response) => {
            console.log('Stock Updated successfully:', response);
            this.stockForm.reset();
            this.navigateToStock();
          },
          (error) => {
            console.error('Failed to update stock:', error);
          }
        );
      }
}
