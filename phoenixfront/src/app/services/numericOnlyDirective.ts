import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumericOnly]'
})
export class NumericOnlyDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
