import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Userdto } from 'src/app/models/agents/Userdto';
import { AgentsService } from 'src/app/services/agents.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit {
  constructor(private agentsService: AgentsService,private router: Router) {}
  allmembers: Userdto[] = [];
  agentList: Userdto[] = [];
  managerList: Userdto[] = [];
  imanagerList: Userdto[] = [];

  showColMd4 = false;
  toggleColMd4() {
    this.showColMd4 = !this.showColMd4;
  }
  ngOnInit(): void{
    this.getUserscategorized();
  }

  getUserscategorized() {
    this.agentsService.getagents().subscribe(
      (data) => {
        this.allmembers = data as Userdto[];
        this.agentList = this.allmembers.filter(user => user.realmRoles?.includes('AGENT'));
        this.managerList = this.allmembers.filter(user => user.realmRoles?.includes('MANAGER'));
        this.imanagerList = this.allmembers.filter(user => user.realmRoles?.includes('IMANAGER'));
      },
      (error: any) => {
        console.error('Error fetching agents:', error);
      }
    );
  }

  navigateToUserInfos(username?: string) {
    if (username === undefined) {
      console.log('Invalid username');
      return;
    }
    this.router.navigate(['/userinfos'], { queryParams: { id: username } });      
  }

  navigateToaddTeam(){
    this.router.navigate(['/addteam']);      
  }
}
