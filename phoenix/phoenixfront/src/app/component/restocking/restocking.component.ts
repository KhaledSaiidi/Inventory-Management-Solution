import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Userdto } from 'src/app/models/agents/Userdto';
import { ReclamType } from 'src/app/models/notifications/ReclamType';
import { ReclamationDto } from 'src/app/models/notifications/ReclamationDto';
import { AgentsService } from 'src/app/services/agents.service';
import { NotificationService } from 'src/app/services/notification.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-restocking',
  templateUrl: './restocking.component.html',
  styleUrls: ['./restocking.component.css']
})
export class RestockingComponent implements OnInit{

  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private router: Router,
    private agentService: AgentsService,
    private notificationService: NotificationService,
    private stockservice: StockService) {}
    username!: string;
    notifForm!: FormGroup;

    ngOnInit() {
      this.route.queryParamMap.subscribe(params => {
        const id = params.get('id');
        if(id != null){
        this.username = id;
        console.log(this.username);
        }
      });
      this.initForm();
      this.getStocks();
      this.getUserscategorized();
      this.fetchProductsInPossession(this.username);
    }

    navigateToUserdetails() {
      if (this.username === undefined) {
        console.log('Invalid Username');
        return;
      }
      this.router.navigate(['/userdetails'], { queryParams: { id: this.username } });      
    }
    initForm(): void {
      this.notifForm = this.formBuilder.group({
        stock: [''],
        text: [''],
        quantity: [''],
        manager: ['']
      });
    }

stocksReferences : String[] = [];
getStocks() {
  try {
    this.stockservice.getStocksByStocksReferences()
      .subscribe(
        (data) => {
          this.stocksReferences = data;
          this.notifForm.patchValue({
            stock: this.stocksReferences[0]
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
          this.notifForm.patchValue({
            manager: this.managerList[0].username
          });

        }
      },
      (error: any) => {
        console.error('Error fetching agents:', error);
      }
    );
  }

  leftProducts: string[] = [];
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
          this.navigateToUserdetails();
        },
        (error) => {
          console.error('Failed to add notif:', error);
        }
      ); 
    }
}
