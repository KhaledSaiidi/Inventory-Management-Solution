import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Campaigndto } from 'src/app/models/agents/Campaigndto';
import { Clientdto } from 'src/app/models/agents/Clientdto';
import { AgentsService } from 'src/app/services/agents.service';

@Component({
  selector: 'app-addcampaign',
  templateUrl: './addcampaign.component.html',
  styleUrls: ['./addcampaign.component.css']
})
export class AddcampaignComponent implements OnInit {
  constructor(private router: Router, private formBuilder: FormBuilder, private agentsService: AgentsService) {}
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


 ngOnInit(): void {
  this.initForm();
  this.getclients();
 }

 initForm(): void {
  this.campaignForm = this.formBuilder.group({
    campaignName: [''],
    client: this.formBuilder.group({
      reference: ['']
    }),
    campaignDescription: ['']
});
}

 navigateToCampaigns(){
    this.router.navigate(['/camapigns']);
  }
  
  
  getclients(){
    this.agentsService.getClients().subscribe(
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
  
  
  onSubmit(): void {
   
    const currentDate = new Date();
    const Campaigndto: Campaigndto = {
      campaignName: this.campaignForm.get('campaignName')?.value,
      campaignDescription: this.campaignForm.get('campaignDescription')?.value,
      client: {
        reference: this.campaignForm.get('client')?.get('reference')?.value
      }
    };
    Campaigndto.products = this.productValues;
    Campaigndto.startDate = currentDate;
    console.log(Campaigndto);
    this.agentsService.addCampaign(Campaigndto).subscribe(
      (response) => {
        console.log('Client added successfully:', response);
        this.campaignForm.reset();
        this.navigateToCampaigns();
      },
      (error) => {
        console.error('Failed to add team:', error);
      }
    );
    
  }

  

}
