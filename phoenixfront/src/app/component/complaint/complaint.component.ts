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
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent implements OnInit {

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
      this.getUserscategorized();
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
        managers: [[]],
        complaintText: ['']
      });
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

          this.notifForm = this.formBuilder.group({
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

    onSubmit(): void {
      const receivers: string[] = this.notifForm.get('managers')?.value || [];
      const notifText: string = this.notifForm.get('complaintText')?.value;

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
          this.notifForm.reset();
          this.navigateToUserdetails();
        },
        (error) => {
          console.error('Failed to add notif:', error);
        }
      ); 
    }
}
