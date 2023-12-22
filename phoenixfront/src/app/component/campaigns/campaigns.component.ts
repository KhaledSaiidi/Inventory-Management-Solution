import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgentsService } from 'src/app/services/agents.service';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {
  constructor(private agentsService: AgentsService,private router: Router) {}

  ngOnInit(): void {
      
  }

  navigateToaddClient(){
    this.router.navigate(['/addclient']);      
  }

}
