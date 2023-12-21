import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
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
  user: Userdto = {};
  constructor(private agentsService: AgentsService, 
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private router: Router) {}
  username!: string;
  get isCodeDisabled(): boolean {
    return !this.isEditable;
    
  }
  userForm!: FormGroup;

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
      username: [{value:this.username, disabled: this.isCodeDisabled }],
      manager:  this.formBuilder.group({
        username: [{value:this.user.manager?.username, disabled: this.isCodeDisabled }]
      }),

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
isManager: boolean = false;
getuserinfos(code : string){
  if(code != null)
  this.agentsService.getuserbycode(code).subscribe((data) => {
    this.user = data as Userdto;
    console.log(this.user);
    if(this.user.usertypemanager == true) {
      this.isManager = true;
    }
    console.log(this.isManager);
    this.userForm.patchValue({
        firstName:  this.user.firstName,
        lastName:  this.user.lastName,
        email:  this.user.email,
        phone:  this.user.phone,
        username:  this.user.username,
        dateDebutContrat:  this.user.dateDebutContrat,
        dateFinContrat:  this.user.dateFinContrat,
        realmRoles:  this.user.realmRoles,
        jobTitle: this.user.jobTitle,
        manager: {
          username: this.user.manager?.username || 'Not assigned yet',
        },
          });
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
  
   
            

      onSubmit(): void{
        const userdto: Userdto = {
          firstName: this.userForm.get('firstName')?.value || this.user.firstName,
          lastName: this.userForm.get('lastName')?.value || this.user.lastName,
          email: this.userForm.get('email')?.value || this.user.email,
          phone: this.userForm.get('phone')?.value || this.user.phone,
          dateDebutContrat: this.userForm.get('dateDebutContrat')?.value || this.user.dateDebutContrat,
          dateFinContrat: this.userForm.get('dateFinContrat')?.value || this.user.dateFinContrat,
          jobTitle: this.userForm.get('jobTitle')?.value || this.user.jobTitle,
          manager: {
            username: this.userForm.get('manager')?.get('username')?.value || this.user.manager?.username
          }
        };
        
        
        console.log(userdto);
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
        this.agentsService.deleteUser(this.username).subscribe(
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
      filteredmanagerList: Userdto[] = [];

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
