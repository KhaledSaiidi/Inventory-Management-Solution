import { Injectable } from '@angular/core';
import * as Quagga from 'quagga';

@Injectable({
  providedIn: 'root'
})
export class BarcodescannerService {
  private initialized = false;
  private audio = new Audio('../../assets/barcode.wav');

  initializeScanner() {
    if (!this.initialized) {
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector('#camera') // Assuming you have #camera in component's template
        },
        decoder: {
          readers: ["code_128_reader"] // Or other readers as needed
        }
      }, (err: any) => {
        if (err) {
          console.error('Error initializing barcode scanner:', err);
        } else {
          this.initialized = true;
          console.log('Barcode scanner initialized');
        }
      });
    }
  }

  startScanning() {
    if (this.initialized) {
      Quagga.start();
      console.log('Barcode scanning started');
    } else {
      console.warn('Scanner not initialized. Call initializeScanner() first.');
    }
  }

  onDetected(callback: (code: string) => void) {
    if (this.initialized) {
      Quagga.onDetected((data: any) => {
        const code = data.codeResult.code;
        console.log('Barcode detected:', code);
        this.audio.play(); // Play sound
        callback(code);
      });
    }
  }
}
