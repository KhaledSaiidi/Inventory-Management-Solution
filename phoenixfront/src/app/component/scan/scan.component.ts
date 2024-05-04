import {  Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { Stockdto } from 'src/app/models/inventory/Stock';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {
  constructor(private renderer: Renderer2, private router: Router,private stocksService: StockService) {}
  


  showCamera = false;
  containerHeight!: number | 'auto';
  containerWidth!: number | 'auto';
  barcodeData: string | null = null;
  barcodes: Set<string> = new Set(['']);
  private barcodeChangeSubject: Subject<{ newValue: string, barcode: string }> = new Subject<{ newValue: string, barcode: string }>();

  stocks: Stockdto[] = [];
  ngOnInit() {
    this.getStocksByStocksReferences();
    this.listener();
    this.barcodeChangeSubject
    .pipe(debounceTime(1000))
    .subscribe(({ newValue, barcode }) => {
      this.barcodes.delete(barcode);
      this.barcodes.add(newValue);
      this.updateSomethingBasedOnBarcodeChange(newValue, barcode);
    });
  
  }
  
  onBarcodeChange(newValue: string, barcode: string) {
    this.barcodeChangeSubject.next({ newValue, barcode });
  }

  updateSomethingBasedOnBarcodeChange(newValue: string, barcode: string) {
    console.log(`Barcode changed: ${barcode} -> ${newValue}`);
    console.log('Barcodes : ' + JSON.stringify([...this.barcodes]));
      this.barcodes.add('');
    }
  
  
  public listener() {
    window.addEventListener('message', (event) => {
      if (event.data.barcode) {
        this.barcodeData = event.data.barcode;
        console.log("barcode angular received : " + this.barcodeData);
        if(this.barcodeData) {
        if (this.barcodeData.length >= 5 && !this.barcodes.has(this.barcodeData)) {
          this.barcodes.add(this.barcodeData);

          console.log(JSON.stringify([...this.barcodes]));

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

  navigateTostocks() {
    this.router.navigate(['/stocks']);
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
  

  proceedCheck(){
    const filteredBarcodes = new Set(Array.from(this.barcodes).filter(barcode => barcode.trim() !== ''));

    this.stocksService.checkProducts(this.stockreference, filteredBarcodes)
    .subscribe(response => {
      console.log(response);
      this.navigateTostocks();
    }, error => {
      console.error(error);
    });

  }
}

 
