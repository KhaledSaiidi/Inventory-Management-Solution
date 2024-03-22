import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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

    ngOnInit() {
      this.route.queryParamMap.subscribe(params => {
        const id = params.get('id');
        if(id != null){
        this.username = id;
        console.log(this.username);
        }
      });
    }

    navigateToUserdetails() {
      if (this.username === undefined) {
        console.log('Invalid Username');
        return;
      }
      this.router.navigate(['/userdetails'], { queryParams: { id: this.username } });      
    }
  

}
