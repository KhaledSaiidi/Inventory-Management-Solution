import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ConfiramtionDialogComponent } from 'src/app/design-component/confiramtion-dialog/confiramtion-dialog.component';
import { Userdto } from 'src/app/models/agents/Userdto';
import { Productdto } from 'src/app/models/inventory/ProductDto';
import { ProductPage } from 'src/app/models/inventory/ProductPage';
import { SoldProductDto } from 'src/app/models/inventory/SoldProductDto';
import { SoldProductPage } from 'src/app/models/inventory/SoldProductPage';
import { AgentsService } from 'src/app/services/agents.service';
import { StockService } from 'src/app/services/stock.service';

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
    private router: Router,
    private stockservice: StockService,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog) {}
  username!: string;
  get isCodeDisabled(): boolean {
    return !this.isEditable;
    
  }
  userForm!: FormGroup;

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
      username: [{value:this.username, disabled: this.isCodeDisabled }],
      manager:  this.formBuilder.group({
        username: [{value:this.user.manager?.username, disabled: this.isCodeDisabled }]
      }),

    });
  this.getUserscategorized();
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
    
      this.getProductsReturnedPaginatedByusername(this.username, 0);
      this.getUserStat(this.username);
      this.getThelast2SoldProdsByusername(this.username);
      this.getThelast2ReturnedProdsByusername(this.username);
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
      selectedTabMyStock() {
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

    
    
   
    
      confirmDeletion(): void {
        const message = 'Are you sure you want to delete : ' + this.user.firstName + ' ' + this.user.lastName + ' ?';
        const dialogRef = this.dialog.open(ConfiramtionDialogComponent, {
          data: { message, onConfirm: () => this.deleteUser(dialogRef) }
        });
    
        dialogRef.componentInstance.onCancel.subscribe(() => {
          dialogRef.close();
        });
      }
      deleteUser(dialogRef: MatDialogRef<ConfiramtionDialogComponent>): void {
        this.agentsService.deleteUser(this.username).subscribe(
          () => {
            console.log('User deleted successfully.');
            dialogRef.close();
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
      
      pageSize: number = 20;
      loading: boolean = true;
      emptyProducts: boolean = true;
      totalPages: number = 0;
      totalElements: number = 0;
      currentPage: number = 0;
      agentProds: Productdto[] = [];
      agentsoldProds: SoldProductDto[] = [];
      pagedProducts: Productdto[][] = [];
    
      getProductsByusername(username: string, page: number) {
        this.loading = true;
        this.emptyProducts = true;
        try {
          this.stockservice.getProductsPaginatedByusername(username, page, this.pageSize)
            .subscribe(
              (productPage: ProductPage) => {
                this.currentPage = productPage.number + 1;
                this.agentProds = productPage.content;
                this.totalPages = productPage.totalPages;
                this.loading = false;
                if(this.agentProds && this.agentProds.length > 0){
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



    loadingsold: boolean = true;
    emptysoldProducts: boolean = true;
    totalsoldPages: number = 0;
    totalsoldElements: number = 0;
    currentsoldPage: number = 0;
    pagedsoldProducts: SoldProductDto[][] = [];
  
    getSoldProductsByusername(username: string, page: number) {
      this.loadingsold = true;
      this.emptysoldProducts = true;
      try {
        this.stockservice.getSoldProductsByusername(username, page, this.pageSize)
          .subscribe(
            (soldproductPage: SoldProductPage) => {
              this.currentsoldPage = soldproductPage.number + 1;
              this.agentsoldProds = soldproductPage.content;
              this.totalsoldPages = soldproductPage.totalPages;
              this.loadingsold = false;
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
    loadingReturn: boolean = true;
    emptyReturnProducts: boolean = true;
    totalReturnPages: number = 0;
    totalReturnElements: number = 0;
    currentReturnPage: number = 0;
    agentReturnProds: Productdto[] = [];
    
    getProductsReturnedPaginatedByusername(username: string, page: number) {
      this.loadingReturn = true;
      this.emptyReturnProducts = true;
      try {
        this.stockservice.getProductsReturnedPaginatedByusername(username, page, this.pageSize)
          .subscribe(
            (productPage: ProductPage) => {
              this.currentReturnPage = productPage.number + 1;
              this.agentReturnProds = productPage.content;
              this.totalReturnElements = productPage.totalPages;
              this.loadingReturn = false;
              if(this.agentReturnProds && this.agentReturnProds.length > 0){
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
 
    
    navigateToSold(){
      this.selectedTab = 1;
      this.selectedProdTab = 1;
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
      navigateToReturn(){
        this.selectedTab = 1;
        this.selectedProdTab = 2;
      }
    
}
