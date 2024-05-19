import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Userdto } from 'src/app/models/agents/Userdto';
import { ReclamType } from 'src/app/models/notifications/ReclamType';
import { ReclamationDto } from 'src/app/models/notifications/ReclamationDto';
import { AgentService } from 'src/app/services/agent.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.scss'],
})
export class SendNotificationComponent  implements OnInit {

  constructor ( public securityService: AuthService, private router: Router,
    private formBuilder: FormBuilder, private notificationService: NotificationService,
    private agentService: AgentService, private stockservice:  StockService
  ) { }
  isRestock: boolean = true;
  isComplaint: boolean = false;
  username!: string;
  notifForm!: FormGroup;
  notifFormC!: FormGroup;

  ngOnInit() {
    if (this.securityService.profile && this.securityService.profile.username) {
      console.log(this.securityService.profile);
      this.username = this.securityService.profile.username;
    }   
    this.getStocks();
    this.getUserscategorized();
    this.fetchProductsInPossession(this.username);
    this.initForm();
    this.initFormC();
}

  navigateTohome(){
      this.router.navigate(['/home']);      
  }

  handleRestockChange() {
    if (this.isRestock) {
      this.isComplaint = false;
    }
  }
  handleComplaintChange() {
    if (this.isComplaint) {
      this.isRestock = false;
    }
  }

  initForm(): void {
    this.notifForm = this.formBuilder.group({
      manager: [''],
      text: [''],
      quantity: [''],
      stock: [''],
    });
  }

  initFormC(): void {
    this.notifFormC = this.formBuilder.group({
      managers: [[]],
      complaintText: ['']
    });
  }

  stocksReferences : String[] = [];
  getStocks() {
    try {
      this.stockservice.getStocksByStocksReferences()
        .subscribe(
          (data) => {
            this.stocksReferences = data;
            const firststock = this.stocksReferences.length > 0 ? this.stocksReferences[0] : '';

            this.notifForm.patchValue({
              stock: firststock
            });
          },
          (error) => {
            console.error('Error fetching stocks:', error);
          }
        );
    } catch (error) {
      console.error('Unexpected error:', error);
    }
    }
    allmembers: Userdto[] = [];
    managerList: Userdto[] = [];
    getUserscategorized() {
      this.agentService.getagents().subscribe(
        (data) => {
          this.allmembers = data as Userdto[];
          if(this.allmembers.length > 0){
            this.managerList = this.allmembers.filter(user => 
              user.realmRoles?.includes('MANAGER') || user.realmRoles?.includes('IMANAGER')
            );
            const firstManagerUsername = this.managerList.length > 0 ? this.managerList[0].username : '';
            this.notifForm.patchValue({
              manager: firstManagerUsername
            });
            this.notifFormC = this.formBuilder.group({
              managers: [firstManagerUsername],
              complaintText: ['']
            });
  
          }
        },
        (error: any) => {
          console.error('Error fetching agents:', error);
        }
      );
    }

    leftProducts: String[] = [];
    fetchProductsInPossession(username: string): void {
      this.stockservice.getProductsInPossession(username)
        .subscribe(
          (data) => {
            this.leftProducts = data;
            console.log('Products in possession:', this.leftProducts);
          },
          (error) => {
            console.error('Error fetching products in possession:', error);
          }
        );
    }
    

    onSubmit(): void {
      const receivers: string[] = []; 
      receivers.push(this.notifForm.get('manager')?.value);
      const notifText: string = this.notifForm.get('text')?.value;
      const quantity: number = this.notifForm.get('quantity')?.value;
      const stock: string = this.notifForm.get('stock')?.value;

      const notification : ReclamationDto = {
        reclamationType: ReclamType.restockingType,
        reclamationText: this.username.toUpperCase() + " asks for " + quantity + " product(s) from the " + stock
        + " he already has " + this.leftProducts.length + " product(s) left! " + " " + "you will find here his request : "
        + "'" + notifText+ "'",
        senderReference: this.username,
        receiverReference: receivers
      }
      console.log(notification);
      this.notificationService.addReclamation(notification).subscribe(
        (response) => {
          this.notifForm.reset();
          this.navigateTohome();
        },
        (error) => {
          console.error('Failed to add notif:', error);
        }
      ); 
    }


    onSubmitC(): void {
      const receivers: string[] = this.notifFormC.get('managers')?.value || [];
      const notifText: string = this.notifFormC.get('complaintText')?.value;

      const notification : ReclamationDto = {
        reclamationType: ReclamType.otherReclamType,
        reclamationText: "You've received a complaint from " + this.username.toUpperCase() 
        + ". Within the complaint text, you'll find the following: "+ "'" + notifText+ "'",
        senderReference: this.username,
        receiverReference: receivers
      }
      console.log(notification);
      this.notificationService.addReclamation(notification).subscribe(
        (response) => {
          this.notifFormC.reset();
          this.navigateTohome();
        },
        (error) => {
          console.error('Failed to add notif:', error);
        }
      ); 
    }
}
