import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Campaigndto } from 'src/app/models/agents/Campaigndto';
import { Clientdto } from 'src/app/models/agents/Clientdto';
import { AgentsService } from 'src/app/services/agents.service';

@Component({
  selector: 'app-update-campaign',
  templateUrl: './update-campaign.component.html',
  styleUrls: ['./update-campaign.component.css']
})
export class UpdateCampaignComponent implements OnInit {
  constructor(private route: ActivatedRoute,private router: Router , private agentservice: AgentsService,private formBuilder: FormBuilder) {
    const reference = this.route.snapshot.paramMap.get('reference');
    this.reference = reference !== null ? reference : '';
  }
  campaignForm!: FormGroup;
  products: any[] = [{ id: 1, isChecked: false }];
  productValues: string[] = [];
  clients: Clientdto[] = [];

  addProduct() {
    const id = this.products.length + 1;
    this.products.push({ id, isChecked: false });
  }
  removeProductsAfter(index: number) {
    this.products.splice(index + 1);
    this.productValues.splice(index + 1);
  }

  updateProductValue(index: number, event: any) {
    if (event && 'value' in event.target) {
      this.productValues[index] = event.target.value;
    }
    }
    onCheckboxChange(checkbox: HTMLInputElement, index: number) {
      if (checkbox.checked) {
        this.addProduct();
      }
      else {
        this.removeProductsAfter(index);
      }
  
    }
  
  reference: string | null;
  isEditable: boolean = false;
  toggleEditable(){
    this.isEditable = !this.isEditable;
    console.log(this.isEditable);
}

ngOnInit(): void {
  this.initForm();
  this.getclients();
  if(this.reference) {
  this.getcampaignbyreference(this.reference);
  console.log(this.isCodeDisabled);

}
}
initForm(): void {
  this.campaignForm = this.formBuilder.group({
    campaignName: new FormControl({ value: '', disabled: this.isCodeDisabled }),
    campaignDescription: new FormControl({ value: '', disabled: this.isCodeDisabled }),
    startDate: new FormControl({ value: '', disabled: this.isCodeDisabled }),
    client: this.formBuilder.group({
      reference: new FormControl('')
    }),

});
}

  navigateToCampigns(){
    this.router.navigate(['/camapigns']);
  }
  get isCodeDisabled(): boolean {
    return !this.isEditable;
  }
  getclients(){
    this.agentservice.getClients().subscribe(
      (data) => {
    this.clients = data as Clientdto[];
    if (this.clients.length > 0) {
      this.campaignForm.patchValue({
        client: {
          reference: this.clients[0].reference
        }
      });
    }
      },
      (error) => {
        console.error('Failed to add team:', error);
      }
    );
  }
campaignProducts: string[] = [];
campaigndto!: Campaigndto;
  getcampaignbyreference(reference : string){
    this.agentservice.getcampaignbyreference(reference).subscribe(
      (data) => {
    this.campaigndto = data as Campaigndto;
    if(this.campaigndto.products){
    this.campaignProducts = this.campaigndto.products;
    }
    console.log(this.campaigndto);
    this.campaignForm.patchValue({
      campaignName: this.campaigndto.campaignName,
      campaignDescription: this.campaigndto.campaignDescription,
      startDate: this.campaigndto.startDate
    });
      },
      (error) => {
        console.error('Failed to add team:', error);
      }
    );
  }



  onSubmit(){
    const Campaigndto: Campaigndto = {
      campaignName: this.campaignForm.get('campaignName')?.value,
      campaignDescription: this.campaignForm.get('campaignDescription')?.value,
      startDate: this.campaignForm.get('startDate')?.value,
      client: {
        reference: this.campaignForm.get('client')?.get('reference')?.value
      }
    };
    if(this.productValues.length > 0) {
    Campaigndto.products = this.productValues;
   } 
    console.log(Campaigndto);
    if(this.reference)
    this.agentservice.updateCampaign(this.reference ,Campaigndto).subscribe(
      (response) => {
        console.log('Campaign updated successfully:', response);
        this.campaignForm.reset();
        this.navigateToCampaigns();
      },
      (error) => {
        console.error('Failed to update campaign:', error);
      }
    );
  }

  navigateToCampaigns(){
    this.router.navigate(['/camapigns']);
  }
}
