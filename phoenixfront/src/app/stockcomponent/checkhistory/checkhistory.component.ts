import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UncheckHistory } from 'src/app/models/inventory/UncheckHistory';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-checkhistory',
  templateUrl: './checkhistory.component.html',
  styleUrls: ['./checkhistory.component.css']
})
export class CheckhistoryComponent implements OnInit{
  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private stockservice: StockService) {}
    stockreference: string = '';
    ngOnInit(): void {
      this.route.queryParamMap.subscribe(params => {
        const id = params.get('id');
        if(id != null){
        this.stockreference = id;
        console.log(this.stockreference);
        }
      }); 
      this.getUncheckedHistorybyStockreference(this.stockreference);
    }
    navigateToProducts(ref?: string) {
      if (ref === undefined) {
        console.log('Invalid ref');
        return;
      }
      this.router.navigate(['/products'], { queryParams: { id: ref } });     
      console.log(ref);
    }

    uncheckedHistories!: UncheckHistory[];
    getUncheckedHistorybyStockreference(ref: string){
      this.stockservice.getUncheckedHistorybyStockreference(ref).subscribe(
        (data) => {
      this.uncheckedHistories = data as UncheckHistory[];
        },
        (error) => {
          console.error('Failed to get UncheckHistory:', error);
        }
      );
    }

    deleteCheck(id: number | undefined){
      if(id){
        this.stockservice.deleteCheck(id).subscribe(
          () => {
            this.getUncheckedHistorybyStockreference(this.stockreference);
          },
          (error) => {
            console.error('Failed to delete UncheckHistory:', error);
          }
        );
        }
    }

    deleteAllCheck(){
        this.stockservice.deleteAllCheck(this.stockreference).subscribe(
          () => {
            this.getUncheckedHistorybyStockreference(this.stockreference);
          },
          (error) => {
            console.error('Failed to delete UncheckHistory:', error);
          }
        );
    }

}
