import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Userdto } from 'src/app/models/agents/Userdto';
import { Productdto } from 'src/app/models/inventory/ProductDto';
import { ProductPage } from 'src/app/models/inventory/ProductPage';
import { SoldProductDto } from 'src/app/models/inventory/SoldProductDto';
import { SoldProductPage } from 'src/app/models/inventory/SoldProductPage';
import { ReclamationDto } from 'src/app/models/notifications/ReclamationDto';
import { AgentsService } from 'src/app/services/agents.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StockService } from 'src/app/services/stock.service';

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
    private router: Router,
    private stockservice: StockService,
    private cdRef: ChangeDetectorRef,
    private notificationService: NotificationService) {}
  username!: string;
  get isCodeDisabled(): boolean {
    return !this.isEditable;
    
  }
  

  async ngOnInit() {
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

    try {
      await   this.getProductsByusername(this.username, 0);
      this.cdRef.detectChanges();
    } catch (error) {
      this.agentProds = [];
        }
        try {
          await   this.getSoldProductsByusername(this.username, 0);
          this.cdRef.detectChanges();
        } catch (error) {
          this.agentsoldProds = [];
            }
    this.getAllReclamationsForsender();
    this.getAllReclamationsForReceiver();
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
isManager: boolean = false;
getuserinfos(code : string){
  if(code != null)
  this.agentsService.getuserbycode(code).subscribe((data) => {
    // handle the retrieved data here
    this.user = data as Userdto;
    console.log(this.user);
    if(this.user.usertypemanager == true) {
      this.isManager = true;
    }
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
      selectedTabMyStock() {
        this.selectedTab = 1;
      }
      selectedTabMessages() {
        this.selectedTab = 2;
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

      pageSize: number = 20;
      loading: boolean = true;
      emptyProducts: boolean = true;
      totalPages: number = 0;
      totalElements: number = 0;
      currentPage: number = 0;
      agentProds: Productdto[] = [];
      pagedProducts: Productdto[][] = [];
    
      getProductsByusername(username: string, page: number) {
        this.loading = true;
        try {
          this.stockservice.getProductsPaginatedByusername(username, page, this.pageSize)
            .subscribe(
              (productPage: ProductPage) => {
                this.currentPage = productPage.number + 1;
                this.agentProds = productPage.content;
                this.totalPages = productPage.totalPages;
              },
              (error) => {
                console.error('Error fetching stocks:', error);
                this.loading = false;
              }
            );
        } catch (error) {
          console.error('Unexpected error:', error);
          this.loading = false;
        }
        }  

        onPageChange(newPage: number): void {
          this.getProductsByusername(this.username, newPage - 1);
      } 


      currentDate: Date = new Date();
      getRemainingDates(date: any | undefined): number {
        if (date && date instanceof Date) {
          const timeDiff: number = date.getTime() - this.currentDate.getTime();
          const daysDiff: number = Math.ceil(timeDiff / (1000 * 3600 * 24));
          return daysDiff;
        } else if(typeof date === 'string') {
          const parsedDate: Date = new Date(date);
          if (!isNaN(parsedDate.getTime())) {
            const timeDiff: number = parsedDate.getTime() - this.currentDate.getTime();
            const daysDiff: number = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return daysDiff; 
        } else {
          return 0;
        } } else {
          return 0;
        }
    }



    selectedProdTab = 0;
    selectedProdTabProf(){
      this.selectedProdTab = 0;
    }
    selectedProdTabMyStock() {
      this.selectedProdTab = 1;

    }
    selectedProdTabMessages() {
      this.selectedProdTab = 2;
    }


    agentsoldProds: SoldProductDto[] = [];
    loadingsold: boolean = true;
    emptysoldProducts: boolean = true;
    totalsoldPages: number = 0;
    totalsoldElements: number = 0;
    currentsoldPage: number = 0;
    pagedsoldProducts: SoldProductDto[][] = [];
  
    getSoldProductsByusername(username: string, page: number) {
      this.loadingsold = true;
      try {
        this.stockservice.getSoldProductsByusername(username, page, this.pageSize)
          .subscribe(
            (soldproductPage: SoldProductPage) => {
              this.loadingsold = false;
              console.log(this.loadingsold  + "xx" + this.emptysoldProducts);
              this.currentsoldPage = soldproductPage.number + 1;
              this.agentsoldProds = soldproductPage.content;
              this.totalsoldPages = soldproductPage.totalPages;
              if(this.agentsoldProds){
                this.emptysoldProducts = false;
              }
            },
            (error) => {
              console.error('Error fetching stocks:', error);
              this.loadingsold = false;
            }
          );
      } catch (error) {
        console.error('Unexpected error:', error);
        this.loadingsold = false;
      }
      }  

      onsoldPageChange(newPage: number): void {
        this.getSoldProductsByusername(this.username, newPage - 1);
    } 


    selectedNotificationTab = 0;
    selectedNotificationTabSent(){
      this.selectedNotificationTab = 0;
    }
    selectedNotificationTabReceived() {
      this.selectedNotificationTab = 1;
    }

    sentreclamations: ReclamationDto[] = [];

    getAllReclamationsForsender(){
      this.notificationService.getAllReclamationsForsender(this.username).subscribe(
        (data) => {
      this.sentreclamations = data as ReclamationDto[];
        },
        (error) => {
          console.error('Failed to get reclamations:', error);
        }
      );
  }

  receivedreclamations: ReclamationDto[] = [];

  getAllReclamationsForReceiver(){
    this.notificationService.getAllReclamationsForReceiver(this.username).subscribe(
      (data) => {
    this.receivedreclamations = data as ReclamationDto[];
      },
      (error) => {
        console.error('Failed to get reclamations:', error);
      }
    );
  
}

}
