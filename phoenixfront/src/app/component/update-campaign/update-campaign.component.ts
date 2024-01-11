import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
}
}
initForm(): void {
  this.campaignForm = this.formBuilder.group({
    campaignName: [''],
    client: this.formBuilder.group({
      reference: ['']
    }),
    campaignDescription: [''],
    startDate: ['']
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
    this.campaignForm.patchValue({
      campaignName: this.campaigndto.campaignName,
      campaignDescription: this.campaigndto.campaignDescription,
      startDate: this.campaigndto.startDate,
      client: {
        reference: this.campaigndto.client?.companyName
      }  

    });
      },
      (error) => {
        console.error('Failed to add team:', error);
      }
    );
  }



  onSubmit(){

  }
}
