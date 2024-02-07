import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Campaigndto } from 'src/app/models/agents/Campaigndto';
import { Stockdto } from 'src/app/models/inventory/Stock';
import { AgentsService } from 'src/app/services/agents.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-addstock',
  templateUrl: './addstock.component.html',
  styleUrls: ['./addstock.component.css']
})
export class AddstockComponent implements OnInit{
  constructor(private router: Router, private agentsService: AgentsService, private stockservice: StockService, private fb: FormBuilder) {}

  campaigns: Campaigndto[] = [];
  navigateToStock(){
    this.router.navigate(['/stocks']);
  }


  ngOnInit(): void {
    this.initializeForm();
    this.getcampaigns();
  }
  stockForm!: FormGroup;
  initializeForm() {
    this.stockForm = this.fb.group({
      reference: [''],
      shippingDate: [null],
      notes: [''],
      receivedDate: [null]
    });
  }

  getcampaigns(){
    this.agentsService.getCampaigns().subscribe(
      (data) => {
    this.campaigns = data as Campaigndto[];
    console.log(this.campaigns);
    if (this.campaigns.length > 0) {
      this.stockForm.patchValue({
        reference: this.campaigns[0].reference
      });
    }
      },
      (error) => {
        console.error('Failed to add team:', error);
      }
    );
  }

  onSubmit(){
    const campaignReference: string = this.stockForm.get('reference')?.value;
    const stockdto: Stockdto = {
      shippingDate: this.stockForm.get('shippingDate')?.value,
      receivedDate: this.stockForm.get('receivedDate')?.value,
      notes: this.stockForm.get('notes')?.value
    }

    this.stockservice.addStock(stockdto, campaignReference).subscribe(
      (response) => {
        console.log('stock added successfully:', response);
        this.stockForm.reset();
        this.navigateToStock();
      },
      (error) => {
        console.error('Failed to add stock:', error);
      }
    );
  }
}
