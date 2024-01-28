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
  areManagers: boolean = true;
  showColMd4 = false;
  toggleColMd4() {
    this.showColMd4 = !this.showColMd4;
  }
  ngOnInit(): void{
    this.getUserscategorized();
  }
  loading: boolean = true;
  emptyagents: boolean = true;
  getUserscategorized() {
    this.agentsService.getagents().subscribe(
      (data) => {
        this.allmembers = data as Userdto[];
        this.loading = false;
        if(this.allmembers.length > 0){
          this.emptyagents = false;
          console.log("emptyStock: " + this.emptyagents);
        this.agentList = this.allmembers.filter(user => user.realmRoles?.includes('AGENT'));
        this.managerList = this.allmembers.filter(user => user.realmRoles?.includes('MANAGER'));
        this.imanagerList = this.allmembers.filter(user => user.realmRoles?.includes('IMANAGER'));
        console.log(this.managerList);
        console.log(this.imanagerList);
        }
        
      },
      (error: any) => {
        console.error('Error fetching agents:', error);
        this.loading = false;
      }
    );
  }

  countAgentsForManagers(userList: Userdto[], managerUsername: string): number {
    let count = 0;
  
    if (userList && userList.length > 0 && managerUsername !== null) {
      count = userList
        .filter(user => user.manager?.username === managerUsername)
        .length;
    }
    return count;
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
