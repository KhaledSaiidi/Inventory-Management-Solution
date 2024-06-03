import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Clientdto } from 'src/app/models/agents/Clientdto';
import { AgentsService } from 'src/app/services/agents.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  companyName: string | null;
  isEditable: boolean = false;
  toggleEditable(){
    this.isEditable = !this.isEditable;
    console.log(this.isEditable);
}
clientForm!: FormGroup;

  constructor(private route: ActivatedRoute,private router: Router , private agentservice: AgentsService,private formBuilder: FormBuilder) {
    const companyName = this.route.snapshot.paramMap.get('companyName');
    this.companyName = companyName !== null ? companyName : '';
  }
  navigateToCampigns(){
    this.router.navigate(['/camapigns']);
  }

  ngOnInit(): void {
      if (this.companyName) {
      console.log(this.companyName);
      this.getClient(this.companyName);
      this.clientForm = this.formBuilder.group({
        companyName: new FormControl({ value: this.client.companyName, disabled: this.isCodeDisabled }),
        companyemail:new FormControl({ value: this.client.companyemail, disabled: this.isCodeDisabled }),
        companyphone: new FormControl({ value: this.client.companyphone, disabled: this.isCodeDisabled }),
        referentfirstName: new FormControl({ value: this.client.referentfirstName, disabled: this.isCodeDisabled }),
        referentlastName: new FormControl({ value:this.client.referentlastName, disabled: this.isCodeDisabled }),
        referentemail: new FormControl({ value: this.client.referentemail, disabled: this.isCodeDisabled }),
        referentphone: new FormControl({ value: this.client.referentphone, disabled: this.isCodeDisabled }),
      });
  
    
    
    } else {
        console.log("companyName is null");
      }
  }
  get isCodeDisabled(): boolean {
    return !this.isEditable;
  }
  client: Clientdto = {};
  getClient(companyName: string) {
    this.agentservice.getclientbycompanyName(companyName).subscribe(
      (data) => {
    this.client = data as Clientdto;
    console.log(this.client);
    this.clientForm.patchValue({
      companyName:  this.client.companyName,
      companyemail:  this.client.companyemail,
      companyphone:  this.client.companyphone,
      referentfirstName:  this.client.referentfirstName,
      referentlastName:  this.client.referentlastName,
      referentemail:  this.client.referentemail,
      referentphone:  this.client.referentphone
        });
      },
      (error) => {
        console.error('Failed to get client:', error);
      }
    );
  }


  onSubmit(){
    const clientdto: Clientdto = {
      companyName: this.clientForm.get('companyName')?.value || this.client.companyName,
      companyemail: this.clientForm.get('companyemail')?.value || this.client.companyemail,
      companyphone: this.clientForm.get('companyphone')?.value || this.client.companyphone,
      referentfirstName: this.clientForm.get('referentfirstName')?.value || this.client.referentfirstName,
      referentlastName: this.clientForm.get('referentlastName')?.value || this.client.referentlastName,
      referentemail: this.clientForm.get('referentemail')?.value || this.client.referentemail,
      referentphone: this.clientForm.get('referentphone')?.value || this.client.referentphone,
    };
    if (this.client.reference !== null && this.client.reference) {
      this.agentservice.updateClient(this.client.reference, clientdto).subscribe(
        response => {
          console.log('Client updated successfully:', response);

          this.navigateToCampigns();
                  
        },
        error => {
          console.log('Error updating Client:', error);
        }
      );
    }
  }
}
