import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Userdto } from 'src/app/models/agents/Userdto';
import { AgentsService } from 'src/app/services/agents.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit {
  constructor(private agentsService: AgentsService,private router: Router, private stockservice: StockService) {}
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
  empptyimanagers: boolean = true;
  empptymanagers: boolean = true;
  getUserscategorized() {
    this.agentsService.getagents().subscribe(
      (data) => {
        this.allmembers = data as Userdto[];
        this.loading = false;
        if(this.allmembers.length > 0){
        this.agentList = this.allmembers.filter(user => user.realmRoles?.includes('AGENT'));
        this.managerList = this.allmembers.filter(user => user.realmRoles?.includes('MANAGER'));
        this.imanagerList = this.allmembers.filter(user => user.realmRoles?.includes('IMANAGER'));
        console.log(this.managerList);
        console.log(this.imanagerList);
        if(this.imanagerList.length > 0){
          this.empptyimanagers = false;
          console.log("emptyStock: " + this.emptyagents);
        }
        if(this.managerList.length > 0){
          this.empptymanagers = false;
          for (let agent of this.managerList) {
            this.getUserStat(agent);
          }

          console.log("emptyStock: " + this.emptyagents);
        }
        if(this.agentList.length > 0){
          this.emptyagents = false;
          for (let agent of this.agentList) {
            this.getUserStat(agent);
          }
          console.log("emptyStock: " + this.emptyagents);
        }
        }
        
      },
      (error: any) => {
        console.error('Error fetching agents:', error);
        this.loading = false;
      }
    );
  }

  getUserStat(user: Userdto) {
    if(user.username){
    this.stockservice.getUserStat(user.username)
      .subscribe(
        (stats: number[]) => {
          user.associatedProds = stats[0];
          user.returnedProds = stats[1];
          user.soldProds = stats[2];
                },
        (error) => {
          console.error('Error fetching last stats :', error);
        }
      );
    }
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
