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
  loadingStates: Map<string, boolean> = new Map();
  getUserscategorized() {
    this.agentsService.getagents().subscribe(
      (data) => {
        this.allmembers = data as Userdto[];
        this.loading = false;
        if(this.allmembers.length > 0){
        this.agentList = this.allmembers.filter(user => user.realmRoles?.includes('AGENT'));
        this.managerList = this.allmembers.filter(user => user.realmRoles?.includes('MANAGER'));
        this.imanagerList = this.allmembers.filter(user => user.realmRoles?.includes('IMANAGER'));

        this.empptyimanagers = this.imanagerList.length === 0;
        this.emptyagents = this.agentList.length === 0;
        this.empptymanagers = this.managerList.length === 0;
        this.processUsers(this.agentList);
        this.processUsers(this.managerList);
       
        }
        
      },
      (error: any) => {
        console.error('Error fetching agents:', error);
        this.loading = false;
      }
    );
  }

  processUsers(users: Userdto[]) {
    users.forEach(user => {
      this.loadingStates.set(user.username || '', true);
      this.getUserStat(user);
    });
  }

  getUserStat(user: Userdto) {
    if(user.username){
    this.stockservice.getUserStat(user.username)
      .subscribe(
        (stats: number[]) => {
          user.associatedProds = stats[0];
          user.returnedProds = stats[1];
          user.soldProds = stats[2];
          this.loadingStates.set(user.username || '', false);
                },
        (error) => {
          console.error('Error fetching last stats :', error);
          this.loadingStates.set(user.username || '', false);
        }
      );
    }
  }  

  isLoading(username: string |  undefined): boolean {
    if(username == undefined) {
      return false;
    }
    return this.loadingStates.get(username) === true;
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
