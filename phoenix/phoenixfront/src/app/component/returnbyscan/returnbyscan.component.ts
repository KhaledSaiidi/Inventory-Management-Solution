import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { AgentProdDto } from 'src/app/models/inventory/AgentProdDto';
import { Stockdto } from 'src/app/models/inventory/Stock';
import { SecurityService } from 'src/app/services/security.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-returnbyscan',
  templateUrl: './returnbyscan.component.html',
  styleUrls: ['./returnbyscan.component.css']
})
export class ReturnbyscanComponent implements OnInit {
  constructor(private renderer: Renderer2, private router: Router,
    private stocksService: StockService,
    public securityService: SecurityService,
    private route: ActivatedRoute) {}
  


  showCamera = false;
  containerHeight!: number | 'auto';
  containerWidth!: number | 'auto';
  barcodeData: string | null = null;
  firstBarcode: string = "";
  stocks: Stockdto[] = [];
  firstBarcodeChangeSubject = new Subject<string>();


  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
    });
    this.getStocksByStocksReferences();
    this.listener();

    this.firstBarcodeChangeSubject
    .pipe(debounceTime(1000)) 
    .subscribe(newValue => {
      this.firstBarcode = newValue;
      console.log("new value :" + this.firstBarcode);
    });

  }
  
onBarcodeChange(newValue: string) {
  this.firstBarcodeChangeSubject.next(newValue);
}

  
  
  public listener() {
    window.addEventListener('message', (event) => {
      if (event.data.barcode) {
        this.barcodeData = event.data.barcode;
        console.log("barcode angular received : " + this.barcodeData);
        if(this.barcodeData) {
        if (this.barcodeData.length >= 6) {
          this.firstBarcode = this.barcodeData;

          console.log("barcode :" + this.firstBarcode);

          } else if (this.barcodeData.length < 5) {
          console.warn("Ignoring barcode less than 5 characters:", this.barcodeData);
        } else {
          console.warn("Ignoring duplicate barcode:", this.barcodeData);
          }
        }
      }
    });
  }


  public handleCancel(): void {
    this.showCamera = false;
    const iframe = document.getElementById('scanner-container')?.querySelector('iframe');
    if (iframe) {
      iframe.parentNode?.removeChild(iframe);
    }  
  }

  nostock: boolean = false;
  stockreference!: string;
  public triggerSnapshot(): void {
    if(this.stockreference) {
    this.showCamera = true;
    const iframe = this.renderer.createElement('iframe');
    iframe.src = '../../../assets/scan/index.html';
    iframe.style.width = '700px';
    iframe.style.height = '250px'; 
    iframe.style.border = 'none';
    const container = this.renderer.selectRootElement('#scanner-container'); 
    this.renderer.appendChild(container, iframe);
    } else {
      this.nostock = true;
    }
  }

  stockReferences: string[] = [];
  getStocksByStocksReferences() {
    this.stocksService.getStocksByStocksReferences().subscribe(
      (data) => {
        this.stockReferences = data as string[];        
      },
      (error: any) => {
        console.error('Error fetching agents:', error);
      }
    );
  }

  selectedStock: string ="Select a stock to proceed !";
  extractStockReference(selectedValue: string) {
    const stockReference = selectedValue.split(' ')[0];
    this.stockreference = stockReference
    console.log(stockReference);
  }
  

  navigateToUserdetails(userName?: string) {
    if (userName === undefined) {
      console.log('Invalid Username');
      return;
    }
    this.router.navigate(['/userdetails'], { queryParams: { id: userName } });      
  }

  agentProd!: AgentProdDto;
  proceedreturn(){
      this.agentProd = {
          username: this.securityService.profile?.username,
          firstname: this.securityService.profile?.firstName,
          lastname: this.securityService.profile?.lastName
      }
      this.stocksService.returnProduct(this.firstBarcode, this.agentProd)
      .subscribe(response => {
      this.navigateToUserdetails(this.securityService.profile?.username);
        }, error => {
            console.error(error);
        });
}
}

 
