import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Userdto } from 'src/app/models/agents/Userdto';
import { AgentsService } from 'src/app/services/agents.service';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-addteam',
  templateUrl: './addteam.component.html',
  styleUrls: ['./addteam.component.css']
})
export class AddteamComponent implements OnInit{
  constructor(private router: Router, private formBuilder: FormBuilder, private agentsService: AgentsService) {}
  teamForm!: FormGroup;
  selectedImage: File | null = null;

  navigateToAppagents(){
    this.router.navigate(['/agents']);
  }

  public ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.teamForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      username: [''],
      password: [''],
      realmRoles: [['']],
      image: [null],
      phone: [null, Validators.pattern("^[0-9]*$")],
      jobTitle: [''],
      dateDebutContrat: [null],
      dateFinContrat: [null]
    });
  }
  userismanager: boolean = false;
  
  updateRoles(event: any): void {
    const selectedRole = event;
    switch (selectedRole) {
      case 'IMANAGER':
        this.teamForm.get('realmRoles')?.setValue(['IMANAGER']);
        this.userismanager = true;
        break;
      case 'MANAGER':
        this.teamForm.get('realmRoles')?.setValue(['MANAGER']);
        this.userismanager = true;
        break;
      case 'AGENT':
        this.teamForm.get('realmRoles')?.setValue(['AGENT']);
        break;
      default:
        break;
    }
  
  }


  onSubmit(): void {
      const userdto: Userdto = this.teamForm.value;
      if (this.selectedImage) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          const base64Content = base64String.split(',')[1];
          userdto.image = base64Content;
          userdto.usertypemanager = this.userismanager;
          console.log(userdto);
          this.submitAgent(userdto);
        };
        reader.readAsDataURL(this.selectedImage);
      } else {
        this.submitAgent(userdto);
      }
    
  }

  private submitAgent(userdto: Userdto): void {
    this.agentsService.addAgent(userdto).subscribe(
      (response) => {
        console.log('Team added successfully:', response);
        this.teamForm.reset();
        this.navigateToAppagents();
      },
      (error) => {
        console.error('Failed to add team:', error);
      }
    );
  }
  


  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
    }
  }
}
