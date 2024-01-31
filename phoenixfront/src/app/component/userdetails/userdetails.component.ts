import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Userdto } from 'src/app/models/agents/Userdto';
import { AgentsService } from 'src/app/services/agents.service';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserdetailsComponent implements OnInit{
  selectedTab = 0;
  passwordForm!: FormGroup;
  securityTab: boolean = false;
  isEditable: boolean = false;
  toggleEditable(){
    this.isEditable = !this.isEditable;
    console.log(this.isEditable);
}


selectedImage: File | null = null;
  user: Userdto = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    realmRoles: [],
    image: '',
    phone: 0,
    jobTitle: '',
    dateDebutContrat: new Date(),
    dateFinContrat:new Date()
  };
  constructor(private agentsService: AgentsService, 
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private router: Router) {}
  username!: string;
  get isCodeDisabled(): boolean {
    return !this.isEditable;
    
  }
  

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if(id != null){
      this.username = id;
      console.log(this.username);
      }
    });
    this.getuserinfos(this.username);
    this.selectedTab = history.state.selectedTab || 0;

    this.userForm = this.formBuilder.group({
      firstName: new FormControl({ value: this.user.firstName, disabled: this.isCodeDisabled }),
      image: [{value: null, disabled: this.isCodeDisabled }],
      email: new FormControl({ value: this.user.email, disabled: this.isCodeDisabled }),
      phone: new FormControl({ value: this.user.phone, disabled: this.isCodeDisabled }),
      jobTitle: new FormControl({ value:this.user.jobTitle, disabled: this.isCodeDisabled }),
      dateDebutContrat: new FormControl({ value: this.user.dateDebutContrat, disabled: this.isCodeDisabled }),
      dateFinContrat: new FormControl({ value: this.user.dateFinContrat, disabled: this.isCodeDisabled }),
      realmRoles: new FormControl({ value: this.user.realmRoles , disabled: this.isCodeDisabled }),
      lastName: [{value: this.user.lastName, disabled: this.isCodeDisabled }],
      username: [{value:this.username, disabled: this.isCodeDisabled }]
    });
    this.initForm();
  }


  private initForm(): void {
    this.passwordForm = this.formBuilder.group({
      newPassword: [''],
      confirmPassword: [''],
    });
  }
  passwordNotValid: boolean = false;
  private checkPasswordValidity(password: string): boolean {
    // Define criteria for password complexity
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    // Update passwordNotValid based on the criteria
    const isPasswordValid = hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter;
    this.passwordNotValid = !isPasswordValid;
  
    return isPasswordValid;
  }
  
  passwordNotMatch: boolean = false;
  updatePassword(): void {
    const username = this.username;
    const newPassword = this.passwordForm.get('newPassword')?.value;
    console.log('newPassword:', newPassword);
    const confPassword = this.passwordForm.get('confirmPassword')?.value;
    if (this.checkPasswordValidity(newPassword)) {
    if (newPassword === confPassword) {
    this.agentsService.updatePassword(username, newPassword).subscribe(
      (response) => {
        console.log('Password updated successfully:', response);
        window.location.reload();
      },
      (error) => {
        console.error('Error updating password:', error);
      }
    );
  } else {
    this.passwordNotMatch = true;
  } }
  }


@ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
getBase64Image(): string {
  if (this.user.image) {
    return `data:image/png;base64,${this.user.image}`;
  } else {
    return '';
  }
}
handleFileInput(event: any) {
  const files = event.target.files;
  if (files && files.length > 0) {
    this.selectedImage = files[0];
  } else {
    this.selectedImage = null;
  }
  console.log(this.selectedImage);
}

getuserinfos(code : string){
  if(code != null)
  this.agentsService.getuserbycode(code).subscribe((data) => {
    // handle the retrieved data here
    this.user = data as Userdto;
    console.log(this.user);
    this.userForm.patchValue({
      firstName:  this.user.firstName,
        lastName:  this.user.lastName,
        email:  this.user.email,
        phone:  this.user.phone,
        username:  this.user.username,
        dateDebutContrat:  this.user.dateDebutContrat,
        dateFinContrat:  this.user.dateFinContrat,
        realmRoles:  this.user.realmRoles,
        jobTitle: this.user.jobTitle
    })
      },
      (error) => {console.error(error);}
      );
    }

      selectedTabProf(){
        this.getuserinfos(this.username);
        this.selectedTab = 0;
      }
      selectedTabMessages() {
        this.selectedTab = 1;
      }
  
      userForm: FormGroup= new FormGroup({
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        email: new FormControl(''),
        phone: new FormControl(''),
        username: new FormControl(''),
        dateDebutContrat: new FormControl(''),
        dateFinContrat: new FormControl(''),
        realmRoles: new FormControl(''),
        image: new FormControl(''),
        jobTitle: new FormControl('')
      });
      
      onSubmit(): void{
        const userdto: Userdto = {
          firstName: this.userForm.get('firstName')?.value || this.user.firstName,
          lastName: this.userForm.get('lastName')?.value || this.user.lastName,
          email: this.userForm.get('email')?.value || this.user.email,
          phone: this.userForm.get('phone')?.value || this.user.phone,
        };
        if (this.selectedImage) {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result as string;
            const base64Content = base64String.split(',')[1];
            userdto.image = base64Content;

            if (this.username !== null) {
              this.agentsService.updateUser(this.username, userdto).subscribe(
                response => {
                  console.log('Agent updated successfully:', response);
                  window.location.reload();
                },
                error => {
                  console.log('Error updating Agent:', error);
                }
              );
            }
          };
          reader.readAsDataURL(this.selectedImage);
        } else {
          if (this.username !== null) {
            this.agentsService.updateUser(this.username, userdto).subscribe(
              response => {
                console.log('Agent updated successfully:', response);
                // Reset the form
                window.location.reload();

              },
              error => {
                console.log('Error updating Agent:', error);
              }
            );
          }
        }
      }

      openSecurity(){
        this.securityTab = !this.securityTab;
      }

}
