import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Userdto } from 'src/app/models/agents/Userdto';
import { AgentsService } from 'src/app/services/agents.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit{
  selectedTab = 0;
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
    userName: '',
    password: '',
    realmRoles: [],
    image: '',
    phone: 0,
    jobTitle: '',
    dateDebutContrat: new Date(),
    dateFinContrat:new Date(),
    manager: {}
  };
  constructor(private agentsService: AgentsService, 
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private router: Router) {}
  userName!: string;
  get isCodeDisabled(): boolean {
    return !this.isEditable;
    
  }
  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if(id != null){
      this.userName = id;
      console.log(this.userName);
      }
    });
    this.getuserinfos(this.userName);
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
      userName: [{value:this.userName, disabled: this.isCodeDisabled }],
      manager: [{value:this.user.manager?.userName, disabled: this.isCodeDisabled }],
    });
  this.getUserscategorized();
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
        userName:  this.user.userName,
        dateDebutContrat:  this.user.dateDebutContrat,
        dateFinContrat:  this.user.dateFinContrat,
        realmRoles:  this.user.realmRoles,
        jobTitle: this.user.jobTitle,
        manager: this.user.manager
        ? `${this.user.manager.firstName} ${this.user.manager.lastName}`
        : 'Not assigned yet',
          })
      },
      (error) => {console.error(error);}
      );
    }

      selectedTabProf(){
        this.getuserinfos(this.userName);
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
        userName: new FormControl(''),
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
          dateDebutContrat: this.userForm.get('dateDebutContrat')?.value || this.user.dateDebutContrat,
          dateFinContrat: this.userForm.get('dateFinContrat')?.value || this.user.dateFinContrat,
          jobTitle: this.userForm.get('jobTitle')?.value || this.user.jobTitle,
        };
        if (this.selectedImage) {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result as string;
            const base64Content = base64String.split(',')[1];
            userdto.image = base64Content;

            if (this.userName !== null) {
              this.agentsService.updateUser(this.userName, userdto).subscribe(
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
          if (this.userName !== null) {
            this.agentsService.updateUser(this.userName, userdto).subscribe(
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
      confirmDeletion(): void {
        const message = 'Etes vous sûr que vous voulez supprimer: ' + this.user.firstName + ' ' + this.user.lastName;
        const confirmation = confirm(message);
        if (confirmation) {
          this.deleteUser();
        }
      }
      deleteUser(): void {
        this.agentsService.deleteUser(this.userName).subscribe(
          () => {
            console.log('User deleted successfully.');
            this.navigatetoAgents();
          },
          (error) => {
            console.error('Error deleting user:', error);
          }
        );
      }

      navigatetoAgents(){
        this.router.navigate(['/agents']);
      }
      
      allmembers: Userdto[] = [];
      managerList: Userdto[] = [];
      getUserscategorized() {
        this.agentsService.getagents().subscribe(
          (data) => {
            this.allmembers = data as Userdto[];
            this.managerList = this.allmembers.filter(user => user.realmRoles?.includes('MANAGER'));
          },
          (error: any) => {
            console.error('Error fetching agents:', error);
          }
        );
      }
    
      
}
