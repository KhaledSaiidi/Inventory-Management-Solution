import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private stockservice: StockService) {}
    stockreference: string = '';
    compcheckedBoxProds: string[] = [];
    invalidCheckedBox: boolean = false;
    ngOnInit(): void {
      this.route.queryParamMap.subscribe(params => {
        const id = params.get('id');
        if(id != null){
        this.stockreference = id;
        console.log(this.stockreference);
        }
      }); 
        this.dataSharingService.checkedBoxProds$.subscribe(checkedBoxProds => {
        this.compcheckedBoxProds = checkedBoxProds;
        if(this.compcheckedBoxProds.length === 0){
          this.invalidCheckedBox = true;
        }
        console.log(this.compcheckedBoxProds);
            });
    }
    navigateToProducts(ref?: string) {
      if (ref === undefined) {
        console.log('Invalid ref');
        return;
      }
      this.router.navigate(['/products'], { queryParams: { id: ref } });     
      console.log(ref);
    }
  }
