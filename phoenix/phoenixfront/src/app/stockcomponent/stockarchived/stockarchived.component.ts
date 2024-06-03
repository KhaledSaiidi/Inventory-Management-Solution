import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Campaigndto } from 'src/app/models/agents/Campaigndto';
import { ArchivedStockDTO } from 'src/app/models/archive/ArchivedStockDTO';
import { AgentsService } from 'src/app/services/agents.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stockarchived',
  templateUrl: './stockarchived.component.html',
  styleUrls: ['./stockarchived.component.css']
})
export class StockarchivedComponent implements OnInit{
  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private stockservice: StockService,
  private agentservice: AgentsService) {}

    campreference!: string;
    loading: boolean = true;
    emptyStock: boolean = true;
    archivedStock!: ArchivedStockDTO[];
    campaigndto!: Campaigndto;
    ngOnInit() {
      this.route.queryParamMap.subscribe(params => {
        const id = params.get('id');
        if(id != null){
        this.campreference = id;
        }
      }); 
      this.getArchivedCampaign(this.campreference);
      this.getArchivedStocks(this.campreference);
    }

    navigateToArchiverProducts(ref?: string) {
      if (ref === undefined) {
        console.log('Invalid ref');
        return;
      }
      this.router.navigate(['/archivedproducts'], { queryParams: { id: ref } });     
      console.log(ref);
    }

    getArchivedCampaign(ref: string): void {
      this.agentservice.getArchivedCampaign(ref)
        .subscribe(
          (data: Campaigndto) => {
            this.campaigndto = data;
            console.log(this.campaigndto);
          },
          (error) => {
            console.error('Error occurred while fetching archived campaign:', error);
          }
        );
    }

    getArchivedStocks(ref: string): void {
      this.stockservice.getArchivedStocksByCampaign(ref)
        .subscribe(
          (data: ArchivedStockDTO[]) => {
            this.archivedStock = data.map(stock => {
              return { ...stock, campaigndto: this.campaigndto };
            });    
            console.log(this.archivedStock);
            this.loading=false;
            if(this.archivedStock) {
              this.emptyStock = false;
            }
          },
          (error) => {
            console.error('Error occurred while fetching archived campaign:', error);
          }
        );
    }

    navigateToStockInfo(ref?: string) {
      if (ref === undefined) {
        console.log('Invalid ref');
        return;
      }
      this.router.navigate(['/archivedproducts'], { queryParams: { id: ref } });
      console.log(ref);
    }
  
  
}
