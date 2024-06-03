import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Clientdto } from 'src/app/models/agents/Clientdto';
import { AgentsService } from 'src/app/services/agents.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent implements OnInit{
  constructor(private router: Router, private formBuilder: FormBuilder,
     private agentsService: AgentsService) {}
  clientForm!: FormGroup;
 ngOnInit(): void {
  this.initForm();
 }

 initForm(): void {
  this.clientForm = this.formBuilder.group({
    companyName: [''],
    companyemail: [''],
    companyphone: [null],
    referentfirstName: [''],
    referentlastName: [''],
    referentemail: [''],
    referentphone: [null],
  });
}

 navigateToCampaigns(){
    this.router.navigate(['/camapigns']);
  }
  
  onSubmit(): void {
    const clientdto: Clientdto= this.clientForm.value;
    this.agentsService.addClient(clientdto).subscribe(
      (response) => {
        console.log('Client added successfully:', response);
        this.clientForm.reset();
        this.navigateToCampaigns();
      },
      (error) => {
        console.error('Failed to add team:', error);
      }
    );
  }

}


