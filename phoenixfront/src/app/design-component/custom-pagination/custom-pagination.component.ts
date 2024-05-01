import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-pagination',
  templateUrl: './custom-pagination.component.html',
  styleUrls: ['./custom-pagination.component.css']
})
export class CustomPaginationComponent {
  @Input() currentPage!: number;
  @Input() totalPages!: number;
  @Output() pageChange = new EventEmitter<number>();
  get pages(): (number | string)[] {
    const pagesToShow = 3; // Adjust as needed
    const startPage = Math.max(1, this.currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + pagesToShow - 1);
    const result: (number | string)[] = [];
    if (startPage > 1) {
      result.push('...');
    }
    for (let i = startPage; i <= endPage; i++) {
      result.push(i);
    }
    if (endPage < this.totalPages) {
      result.push('...');
    }
    return result;
  }
  pageClick(page: number | string): void {
    if (typeof page === 'number') {
      this.pageChange.emit(page);
    }
  }
}
