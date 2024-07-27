import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner, ScanOptions } from '@capacitor-community/barcode-scanner';
import { AlertController } from '@ionic/angular';
import { Subject, debounceTime } from 'rxjs';
import { AgentProdDto } from 'src/app/models/inventory/AgentProdDto';
import { AuthService } from 'src/app/services/auth.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss'],
})
export class ReturnComponent  implements AfterViewInit , OnDestroy{

  result!: string;
  scanActive = false;
  firstBarcodeChangeSubject = new Subject<string>();
  stockreference!: string;
  
    constructor(private alertController: AlertController, private router: Router,
       private stockservice: StockService, public securityService: AuthService,
      private route: ActivatedRoute) { }
  
  ngAfterViewInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if(id != null){
      this.stockreference = id;
      }
    });  
    BarcodeScanner.prepare();
    this.startScanner();
    this.firstBarcodeChangeSubject
    .pipe(debounceTime(1000)) 
    .subscribe(newValue => {
      this.result = newValue;
      console.log("new value :" + this.result);
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
        if(result.hasContent && result.content.length >= 5) {
          this.result = result.content;
          this.scanActive = false;
              const audio = new Audio();
              audio.src = 'assets/barcode.wav';
              audio.load();    
              audio.play();    
         } else if (this.result.length < 5) {
              console.warn("Ignoring barcode less than 5 characters:", result.content);
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

    navigateTohome(){
      this.router.navigate(['/home']);      
    }
  
    onBarcodeChange(newValue: string) {
      this.firstBarcodeChangeSubject.next(newValue);
    }
    
  

  agentProd!: AgentProdDto;
  proceedreturn(){
    this.agentProd = {
          username: this.securityService.profile?.username,
          firstname: this.securityService.profile?.firstName,
          lastname: this.securityService.profile?.lastName
        }
    this.stockservice.returnProduct(this.result, this.agentProd)
    .subscribe(response => {
    this.navigateTohome(); }, error => {
            console.error(error);
        });
      }
 }
    
  
  