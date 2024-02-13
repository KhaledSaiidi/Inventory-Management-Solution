import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Userdto } from 'src/app/models/agents/Userdto';
import { AgentProdDto } from 'src/app/models/inventory/AgentProdDto';
import { Productdto } from 'src/app/models/inventory/ProductDto';
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
        this.compcheckedBoxProds = checkedBoxProds;
        if(this.compcheckedBoxProds.length === 0){
          this.invalidCheckedBox = true;
        } else {
          for (let i = 0; i < this.compcheckedBoxProds.length; i++) {
            const serialNumber = this.compcheckedBoxProds[i];
            this.stockservice.getProductByserialNumber(serialNumber).subscribe(
              (product: Productdto) => {
                this.products.push(product);
              },
              (error) => {
                console.error('Failed to add stock:', error);
              }
            );
          }
        }
            });
            this.getUserscategorized();
            this.initializeForm();
    }
    navigateToProducts(ref?: string) {
      if (ref === undefined) {
        console.log('Invalid ref');
        return;
      }
      this.router.navigate(['/products'], { queryParams: { id: ref } });     
    }
    allmembers: Userdto[] = [];
    agentList: Userdto[] = [];
    managerList: Userdto[] = [];  
    getUserscategorized() {
      this.agentsService.getagents().subscribe(
        (data) => {
          this.allmembers = data as Userdto[];
          if(this.allmembers.length > 0){
          this.agentList = this.allmembers.filter(user => user.realmRoles?.includes('AGENT'));
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

    onSubmit() {
      const manager: Userdto = this.assignForm.get('manager')?.value;
      const agent: Userdto = this.assignForm.get('agent')?.value;
      const agentOnProds: AgentProdDto = {
        username: agent.username,
        firstname: agent.firstName,
        lastname: agent.lastName,
        seniorAdvisorusername: manager.username,
        seniorAdvisorFirstName: manager.firstName,
        seniorAdvisorLastName: manager.lastName,
        productsAssociated: this.products
      };
      console.log(agentOnProds);
    }

 }
