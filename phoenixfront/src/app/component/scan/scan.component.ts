import {  Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
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
  barcodes: Set<string> = new Set(); 
  stocks: Stockdto[] = [];
  ngOnInit() {
   this.listener();
  }

  public listener() {
    window.addEventListener('message', (event) => {
      if (event.data.barcode) {
        this.barcodeData = event.data.barcode;
        console.log("barcode angular received : " + this.barcodeData);
        if(this.barcodeData) {
        if (this.barcodeData.length >= 5 && !this.barcodes.has(this.barcodeData)) {
          this.barcodes.add(this.barcodeData);

          this.barcodes.forEach((barcode) => {
            console.log(`Barcode: ${barcode}`);
          });

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
  stockreference: string = "kkk";
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
  getUserscategorized() {
    this.stocksService.getStocksByStocksReferences().subscribe(
      (data) => {
        this.stockReferences = data as string[];        
      },
      (error: any) => {
        console.error('Error fetching agents:', error);
      }
    );
  }
}

 