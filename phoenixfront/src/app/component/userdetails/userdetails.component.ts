import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Userdto } from 'src/app/models/agents/Userdto';
import { Productdto } from 'src/app/models/inventory/ProductDto';
import { ProductPage } from 'src/app/models/inventory/ProductPage';
import { SoldProductDto } from 'src/app/models/inventory/SoldProductDto';
import { SoldProductPage } from 'src/app/models/inventory/SoldProductPage';
import { ReclamType } from 'src/app/models/notifications/ReclamType';
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
      }
      const selectedTabParam = params.get('selectedTab');
      this.selectedTab = selectedTabParam !== null ? +selectedTabParam : 0;
    });




    this.getuserinfos(this.username);

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

    try {
      await   this.getProductsReturnedPaginatedByusername(this.username, 0);
      this.cdRef.detectChanges();
    } catch (error) {
      this.agentProds = [];
        }
    this.getAllReclamationsForsender();
    this.getAllReclamationsForReceiver();
    this.getThelast2ReturnedProdsByusername(this.username);
    this.getThelast2SoldProdsByusername(this.username);
    this.getUserStat(this.username);
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
    const confPassword = this.passwordForm.get('confirmPassword')?.value;
    if (this.checkPasswordValidity(newPassword)) {
    if (newPassword === confPassword) {
    this.agentsService.updatePassword(username, newPassword).subscribe(
      (response) => {
        this.securityTab = false;
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
}
isManager: boolean = false;
getuserinfos(code : string){
  if(code != null)
  this.agentsService.getuserbycode(code).subscribe((data) => {
    // handle the retrieved data here
    this.user = data as Userdto;
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
                  this.getuserinfos(this.username);
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
                this.getuserinfos(this.username);
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
    
      getProductsByusername(username: string, page: number) {
        this.loading = true;
        try {
          this.stockservice.getProductsPaginatedByusername(username, page, this.pageSize)
            .subscribe(
              (productPage: ProductPage) => {
                this.loading = false;
                this.currentPage = productPage.number + 1;
                this.agentProds = productPage.content;
                this.totalPages = productPage.totalPages;
                if(this.agentProds && this.agentProds.length >0) {
                  this.emptyProducts = false;
                }
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

    navigateToSold(){
      this.selectedTab = 1;
      this.selectedProdTab = 1;
    }
    navigateToReturn(){
      this.selectedTab = 1;
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
              this.currentsoldPage = soldproductPage.number + 1;
              this.agentsoldProds = soldproductPage.content;
              this.totalsoldPages = soldproductPage.totalPages;
              if(this.agentsoldProds && this.agentsoldProds.length > 0){
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
    
    selectedNotificationTabReceived() {
      this.selectedNotificationTab = 0;
    }
    selectedNotificationTabSent(){
      this.selectedNotificationTab = 1;
    }

    sentreclamations: ReclamationDto[] = [];
    loadingsent: boolean = true;
    emptysent: boolean = true;
  
    getAllReclamationsForsender(){
      this.loadingsent = true;
      this.emptysent = true;  
      this.notificationService.getAllReclamationsForsender(this.username).subscribe(
        (data) => {
          this.loadingsent = false;
      this.sentreclamations = data as ReclamationDto[];
      if(this.sentreclamations && this.sentreclamations.length > 0) {
        this.emptysent = false;
      }  
        },
        (error) => {
          this.loadingsent = false;
          console.error('Failed to get reclamations:', error);
        }
      );
  }

  receivedreclamations: ReclamationDto[] = [];
  loadingreceive: boolean = true;
  emptyreceive: boolean = true;
  getAllReclamationsForReceiver(){
    this.loadingreceive = true;
    this.emptyreceive = true;
    this.notificationService.getAllReclamationsForReceiver(this.username).subscribe(
      (data) => {
        this.loadingreceive = false;
    this.receivedreclamations = data as ReclamationDto[];
    if(this.receivedreclamations && this.receivedreclamations.length > 0) {
      this.emptyreceive = false;
    }
      },
      (error) => {
        this.loadingreceive = false;
        console.error('Failed to get reclamations:', error);
      }
    ); 
}

getReclamationTypeText(reclamationType: ReclamType): string {
  const typo: string = reclamationType.toString();
  if (typo === "prodReturnType") {
    return 'Returned Product';
  } else if (typo === "prodSoldType") {
    return 'Sold Product';
  } else if (typo === "restockingType") {
    return 'Restocking Request';
  } else if (typo === "stockExpirationReminder") {
    return 'Product Expiration Alert';
  } else if (typo === "otherReclamType") {
    return 'Complaint';
  }
      return 'Unknown';
}

navigateToRestocking() {
  if (this.username === undefined) {
    return;
  }
  this.router.navigate(['/restocking'], { queryParams: { id: this.username } });      
}

navigateToComplaint() {
  if (this.username === undefined) {
    return;
  }
  this.router.navigate(['/complaint'], { queryParams: { id: this.username } });      
}


loadingReturn: boolean = true;
emptyReturnProducts: boolean = true;
totalReturnPages: number = 0;
totalReturnElements: number = 0;
currentReturnPage: number = 0;
agentReturnProds: Productdto[] = [];

getProductsReturnedPaginatedByusername(username: string, page: number) {
  this.loadingReturn = true;
  try {
    this.stockservice.getProductsReturnedPaginatedByusername(username, page, this.pageSize)
      .subscribe(
        (productPage: ProductPage) => {
          this.loadingReturn = false;
          this.currentReturnPage = productPage.number + 1;
          this.agentReturnProds = productPage.content;
          console.log("this.agentReturnProds :" + this.agentReturnProds)
          this.totalReturnElements = productPage.totalPages;
          if(this.agentReturnProds && this.agentReturnProds.length > 0) {
            this.emptyReturnProducts = false;
          }
        },
        (error) => {
          console.error('Error fetching stocks:', error);
          this.loadingReturn = false;
        }
      );
  } catch (error) {
    console.error('Unexpected error:', error);
    this.loadingReturn = false;
  }
  }  

  onPageReturnChange(newPage: number): void {
    this.getProductsReturnedPaginatedByusername(this.username, newPage - 1);
} 

checkReturn(serialNumber: string | undefined){
  if(serialNumber){
    this.stockservice.checkReturn(serialNumber)
    .subscribe(
      (response) => {
        console.log("checked");
        try {
         this.getProductsReturnedPaginatedByusername(this.username, 0);
          this.cdRef.detectChanges();
        } catch (error) {
          this.agentProds = [];
            }
      },
      (error) => {
       console.error('Error checking:', error);
      }
    );
    }
  }

  lastsoldProds: SoldProductDto[] = [];
  lastreturnedProds: Productdto[] = [];
  loadinglastReturns: boolean = true;
  emptylastReturnss: boolean = true;

  getThelast2ReturnedProdsByusername(username: string) {
    this.loadinglastReturns = true;
    this.emptylastReturnss = true;
      this.stockservice.getThelast2ReturnedProdsByusername(username)
        .subscribe(
          (products: Productdto[]) => {
            this.loadinglastReturns = false;
            this.lastreturnedProds = products;
            if(this.lastreturnedProds && this.lastreturnedProds.length > 0) {
              this.emptylastReturnss = false;
            }
          },
          (error) => {
            this.loadinglastReturns = false;
            console.error('Error fetching last products returned:', error);
          }
        );
    }  
  loadinglastsells: boolean = true;
    emptylastsells: boolean = true;
    getThelast2SoldProdsByusername(username: string) {
      this.loadinglastsells = true;
      this.emptylastsells = true;
      this.stockservice.getThelast2SoldProdsByusername(username)
        .subscribe(
          (products: SoldProductDto[]) => {
            this.loadinglastsells = false;
            this.lastsoldProds = products;
            if(this.lastsoldProds && this.lastsoldProds.length > 0){
              this.emptylastsells = false;
            }
            console.log("this.loadinglastsells :" + this.loadinglastsells)
          },
          (error) => {
            this.loadinglastsells = false;
            console.error('Error fetching last products returned:', error);
          }
        );
    }  

    associatedProds: number = 0;
    returnedProds: number = 0;
    soldProds: number = 0;

    getUserStat(username: string) {
      this.stockservice.getUserStat(username)
        .subscribe(
          (stats: number[]) => {
            this.associatedProds = stats[0];
            this.returnedProds = stats[1];
            this.soldProds = stats[2];
                  },
          (error) => {
            console.error('Error fetching last stats :', error);
          }
        );
    }  

}