import { Component, OnInit } from '@angular/core';
import { BarcodescannerService } from 'src/app/services/barcodescanner.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {
  barcodeData: string | null = null;

  constructor(private barcodeScanner: BarcodescannerService) {}

  ngOnInit() {
    this.barcodeScanner.initializeScanner();
    this.barcodeScanner.startScanning();

  }


  handleDetectedCode(code: string) {
    this.barcodeData = code;
    console.log("detected : " + code);
  }
}
