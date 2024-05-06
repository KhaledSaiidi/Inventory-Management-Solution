import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confiramtion-dialog',
  templateUrl: './confiramtion-dialog.component.html',
  styleUrls: ['./confiramtion-dialog.component.css']
})
export class ConfiramtionDialogComponent {
  @Input() message!: string;
  @Output() onCancel = new EventEmitter<void>();
  @Input() onConfirm!: () => void;
  loadingPop: boolean = false;

  constructor(private cdr: ChangeDetectorRef,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = data.message;
    this.onConfirm = data.onConfirm;
  }

  confirm(): void {
    this.loadingPop = true; 
    this.cdr.detectChanges();
    console.log("loadingPop :" + this.loadingPop);
  setTimeout(() => {
    this.onConfirm();
  }, 2000);
}

  cancel(): void {
    this.onCancel.emit();
  }

}
