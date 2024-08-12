import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Userdto } from 'src/app/models/agents/Userdto';
import { AgentProdDto } from 'src/app/models/inventory/AgentProdDto';
import { Productdto } from 'src/app/models/inventory/ProductDto';
import { Stockdto } from 'src/app/models/inventory/Stock';
import { AgentsService } from 'src/app/services/agents.service';
import { DataSharingService } from 'src/app/services/dataSharing.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-assignproducts',
  templateUrl: './assignproducts.component.html',
  styleUrls: ['./assignproducts.component.css']
})
export class AssignproductsComponent implements OnInit {
  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private dataSharingService: DataSharingService,
    private stockservice: StockService,
    private agentsService: AgentsService,
    private fb: FormBuilder) {}

    stockreference: string = '';
    compcheckedBoxProds: string[] = [];
    invalidCheckedBox: boolean = false;
    products: Productdto[] = [];

    ngOnInit(): void {
      this.route.queryParamMap.subscribe(params => {
        const id = params.get('id');
        if(id != null){
        this.stockreference = id;
        }
      }); 
      this.dataSharingService.checkedBoxProds$.subscribe(checkedBoxProds => {
        this.handleCheckedBoxProds(checkedBoxProds);
      });    
        this.getStockbyRef(this.stockreference);
        this.getUserscategorized();
        this.initializeForm();
    }
    private handleCheckedBoxProds(checkedBoxProds: any[]): void {
      this.compcheckedBoxProds = checkedBoxProds;
      if (this.compcheckedBoxProds.length === 0) {
        this.invalidCheckedBox = true;
      } else {
        for (let i = 0; i < this.compcheckedBoxProds.length; i++) {
          const serialNumber = this.compcheckedBoxProds[i];
          this.stockservice.getProductByserialNumber(serialNumber).subscribe(
            (product: Productdto) => {
              this.products.push(product);
              this.checkProductassignements(product);
            },
            (error) => {
              console.error('Failed to add stock:', error);
            }
          );
        }
        console.log(this.products);
      }
    }
    assignedToagent: boolean = false;
    assignedTomanager: boolean = false;
    productsassignedToAgent: Productdto[] = [];
    productsassignedToManager: Productdto[] = [];
    checkProductassignements(product: Productdto) {
        if(product.agentProd != null){
          this.assignedToagent = true;
          console.log(this.assignedToagent);
          this.productsassignedToAgent.push(product);
        } 
        if(product.managerProd != null){
          this.assignedTomanager = true;
          console.log(this.assignedTomanager);
          this.productsassignedToManager.push(product);
        }
    }
    navigateToProducts(ref?: string) {
      if (ref === undefined) {
        console.log('Invalid ref');
        return;
      }
      this.router.navigate(['/products'], { queryParams: { id: ref } });     
    }
    allmembers: Userdto[] = [];
    managerList: Userdto[] = [];  
    getUserscategorized() {
      this.agentsService.getagents().subscribe(
        (data) => {
          this.allmembers = data as Userdto[];
          if(this.allmembers.length > 0){
          this.managerList = this.allmembers.filter(user => user.realmRoles?.includes('MANAGER'));
          }
        },
        (error: any) => {
          console.error('Error fetching agents:', error);
        }
      );
    }
    assignForm!: FormGroup;
    initializeForm() {
      this.assignForm = this.fb.group({
        manager: ['Assign a senior advisor'],
        agent: ['Assign an agent']
        });
    }

    stockdto!: Stockdto;
    getStockbyRef(ref : string){
      this.stockservice.getStockByreference(ref).subscribe(
        (data) => {
      this.stockdto = data as Stockdto;
        },
        (error) => {
          console.error('Failed to get stock:', error);
        }
      );
    }

    onSubmit() {
      const manager: Userdto = this.assignForm.get('manager')?.value;
      const agent: Userdto = this.assignForm.get('agent')?.value;
      const agentOnProds: AgentProdDto | null = agent?.username ? {
        username: agent.username,
        firstname: agent.firstName,
        lastname: agent.lastName,
        duesoldDate: this.stockdto.dueDate,
        receivedDate: this.stockdto.receivedDate,
        seniorAdvisor: false,
        productsAssociated: this.products
      } : null;
        
      const managerOnProds: AgentProdDto | null = manager?.username ? {
        username: manager.username,
        firstname: manager.firstName,
        lastname: manager.lastName,
        duesoldDate: this.stockdto.dueDate,
        receivedDate: this.stockdto.receivedDate,
        seniorAdvisor: true,
        productsManaged: this.products
      } : null;

      const agentProdDtos: AgentProdDto[] = [];
      if(agentOnProds && managerOnProds){
        agentProdDtos.push(agentOnProds, managerOnProds);
      }
      if(agentOnProds){
        agentProdDtos.push(agentOnProds);
       }
      if(managerOnProds) {
        agentProdDtos.push(managerOnProds);
      }
      console.log(agentProdDtos);

      this.stockservice.assignAgentsToProd(agentProdDtos).subscribe(
        () => {
          console.log('Agents and managers assigned successfully:');
          this.navigateToProducts(this.stockreference);
        },
        (error) => {
          console.error('Error assigning agents and managers:', error);
        }
      );
        }

 }
