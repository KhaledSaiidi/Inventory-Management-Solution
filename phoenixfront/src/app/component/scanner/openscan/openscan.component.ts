import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-openscan',
  templateUrl: './openscan.component.html',
  styleUrls: ['./openscan.component.css']
})
export class OpenscanComponent implements OnInit {
  constructor(private router: Router) {

  }
  public showCamera = false;
  public webcamImage: WebcamImage | null = null;
  public triggerObservable: Subject<void> = new Subject<void>();
  public containerHeight!: number | 'auto';
  public containerWidth!: number | 'auto';
  
  public ngOnInit(): void {
    this.updateContainerSize();
  }

  public triggerSnapshot(operationType: string): void {
    this.showCamera = !this.showCamera;
    this.updateContainerSize();
    this.triggerObservable.next(); // Notify the webcam component to capture an image

    // Handle the operation type (sell, return, add) as needed
    switch (operationType) {
      case 'sell':
        // Handle sell operation
        break;
      case 'return':
        // Handle return operation
        break;
      case 'add':
        // Handle add operation
        break;
      default:
        break;
    }
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    // Handle the image captured from the camera as needed
  }

  public handleInitError(error: WebcamInitError): void {
    console.error(error);
  }

  public handleCancel(): void {
    this.showCamera = false;
    this.updateContainerSize();
  }

  private updateContainerSize(): void {
    // Set the container size based on whether the camera is open or closed
    this.containerHeight = this.showCamera ? window.innerHeight : 'auto';
    this.containerWidth = this.showCamera ? window.innerWidth : 'auto';
  }

  public get triggerButtonText(): string {
    return this.showCamera ? 'Close Camera' : 'Open Camera';
  }


  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
