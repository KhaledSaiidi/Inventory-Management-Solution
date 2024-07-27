import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner, ScanOptions } from '@capacitor-community/barcode-scanner';
import {  ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
})
export class CheckComponent  implements AfterViewInit , OnDestroy{

result!: string;
scanActive = false;
barcodes: Set<string> = new Set(['']);
private barcodeChangeSubject: Subject<{ newValue: string, barcode: string }> = new Subject<{ newValue: string, barcode: string }>();
stockreference!: string;

  constructor(private alertController: AlertController, private router: Router, private stockservice: StockService,
    private route: ActivatedRoute
  ) { }

ngAfterViewInit(): void {
  this.route.queryParamMap.subscribe(params => {
    const id = params.get('id');
    if(id != null){
    this.stockreference = id;
    console.log("this.stockreference :" + this.stockreference);
    }
  });

  BarcodeScanner.prepare();
  this.startScanner();
  this.barcodeChangeSubject
  .pipe(debounceTime(1000))
  .subscribe(({ newValue, barcode }) => {
    this.barcodes.delete(barcode);
    this.barcodes.add(newValue);
    this.updateSomethingBasedOnBarcodeChange(newValue, barcode);
  });

}
  ngOnDestroy() {
    this.stopScanner();
  }

  async startScanner() {
    const allowed = await this.checkPermission();
    if(allowed) {
      this.scanActive = true;
      const options: ScanOptions = {
        targetedFormats: ['CODE_128'],
        cameraDirection: 'back'
      };
      document.body.style.backgroundColor = 'transparent';

      const result = await BarcodeScanner.startScan(options);
      console.log("result :" + result);
      if(result.hasContent){
        this.result = result.content;
        this.scanActive = false;
          if (this.result.length >= 5 && !this.barcodes.has(this.result)) {
            const audio = new Audio();
            audio.src = 'assets/barcode.wav';
            audio.load();    
            this.barcodes.add(this.result);
            audio.play();    
            console.log(JSON.stringify([...this.barcodes]));
            } else if (this.result.length < 5) {
            console.warn("Ignoring barcode less than 5 characters:", this.result);
          } else {
            console.warn("Ignoring duplicate barcode:", this.result);
            }
      }
    }
  }

  async checkPermission(): Promise<boolean>  {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({force : true});
      if(status.granted){
        resolve(true);
      } else if (status.denied) {
        const alert = await this.alertController.create({
          header: 'No permission',
          message: 'Please allow camera access in your settings',
          buttons: [{
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Open Settings',
            handler: () => {
              BarcodeScanner.openAppSettings();
              resolve(false);
            }
          }]
          });
          await alert.present();
      } else {
        resolve(false);
      }
    });
  }


  async stopScanner() {
      BarcodeScanner.stopScan();
      this.scanActive = false;
  }

  nextScan(){
    this.stopScanner();
    this.startScanner();
  }
  navigateTohome(){
    this.router.navigate(['/home']);      
  }

  onBarcodeChange(newValue: string, barcode: string) {
    this.barcodeChangeSubject.next({ newValue, barcode });
  }

  updateSomethingBasedOnBarcodeChange(newValue: string, barcode: string) {
    console.log(`Barcode changed: ${barcode} -> ${newValue}`);
    console.log('Barcodes : ' + JSON.stringify([...this.barcodes]));
      this.barcodes.add('');
    }

    proceedCheck(){
      const filteredBarcodes = new Set(Array.from(this.barcodes).filter(barcode => barcode.trim() !== ''));
      console.log("filteredBarcodes : "+ JSON.stringify([...filteredBarcodes]));
      console.log("filteredBarcodes : "+ filteredBarcodes);
      console.log("this.stockreference : "+ this.stockreference);
       this.stockservice.checkProducts(this.stockreference, filteredBarcodes)
      .subscribe(response => {
        console.log(response);
        this.scanActive = false;
        this.navigateTohome();
      }, error => {
        console.error(error);
      });
    }
  
}
