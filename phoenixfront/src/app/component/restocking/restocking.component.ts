import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-restocking',
  templateUrl: './restocking.component.html',
  styleUrls: ['./restocking.component.css']
})
export class RestockingComponent implements OnInit{

  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private router: Router,
    private notificationService: NotificationService) {}
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
        type: [''],
        quantity: [''],
        manager: ['']
      });
    }

    /*
    this.campaignForm.patchValue({
      reference: this.clients[0].reference
    });

*/
    onSubmit(): void {
    }
}
