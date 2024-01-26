import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Campaigndto } from 'src/app/models/agents/Campaigndto';
import { AgentsService } from 'src/app/services/agents.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-updatestock',
  templateUrl: './updatestock.component.html',
  styleUrls: ['./updatestock.component.css']
})
export class UpdatestockComponent implements OnInit {
  constructor(private router: Router,
     private agentsService: AgentsService,
     private route: ActivatedRoute,
     private stockservice: StockService,
     private fb: FormBuilder) {}

       campaigns: Campaigndto[] = [];
       navigateToStock(){
         this.router.navigate(['/stock']);
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
        this.getcampaigns();
      }  
      stockForm!: FormGroup;
      initializeForm() {
        this.stockForm = this.fb.group({
          reference: [''],
          stockDate: [null],
          notes: [''],
          checked: null
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
            console.error('Failed to get campaign:', error);
          }
        );
      }
      onSubmit(){

      }

}
