import {  Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { Userdto } from 'src/app/models/agents/Userdto';
import { AgentProdDto } from 'src/app/models/inventory/AgentProdDto';
import { Stockdto } from 'src/app/models/inventory/Stock';
import { AgentsService } from 'src/app/services/agents.service';
import { SecurityService } from 'src/app/services/security.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-sellprod',
  templateUrl: './sellprod.component.html',
  styleUrls: ['./sellprod.component.css']
})
export class SellprodComponent implements OnInit {
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
    this.triggerSnapshot();
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

  public triggerSnapshot(): void {
    this.showCamera = true;
    const iframe = this.renderer.createElement('iframe');
    iframe.src = '../../../assets/scan/index.html';
    iframe.style.width = '700px';
    iframe.style.height = '250px'; 
    iframe.style.border = 'none';
    const container = this.renderer.selectRootElement('#scanner-container'); 
    this.renderer.appendChild(container, iframe);
  }
  

  navigateToUserdetails(userName?: string) {
    if (userName === undefined) {
      console.log('Invalid Username');
      return;
    }
    this.router.navigate(['/userdetails'], { queryParams: { id: userName } });      
  }

  agentProd!: AgentProdDto;
  proceedsell(){
      this.agentProd = {
          username: this.securityService.profile?.username,
          firstname: this.securityService.profile?.firstName,
          lastname: this.securityService.profile?.lastName
      }
      console.log(this.agentProd, this.firstBarcode);

      this.stocksService.sellProduct(this.agentProd, this.firstBarcode)
      .subscribe(response => {
      this.navigateToUserdetails(this.securityService.profile?.username);
        }, error => {
            console.error(error);
        });
        
}
}

 
