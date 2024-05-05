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
  loading: boolean = false;

  constructor(private cdr: ChangeDetectorRef,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = data.message;
    this.onConfirm = data.onConfirm;
  }

  confirm(): void {
    this.loading = true; 
    this.cdr.detectChanges();
    if(this.loading == true) {
      console.log(this.loading);
    this.onConfirm();
    }
  }

  cancel(): void {
    this.onCancel.emit();
  }

}
