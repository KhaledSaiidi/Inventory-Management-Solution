import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Productdto } from 'src/app/models/inventory/ProductDto';

@Pipe({
  name: 'filterProducts'
})
export class FilterProductsPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(products: Productdto[] | null, searchTerm: string): Productdto[] | null {
    if (!products) {
      return null;
    }
    
    if (!searchTerm) {
      return products;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filteredProducts = products.filter(prod =>
      this.matchSearchTerm(prod.serialNumber, lowerCaseSearchTerm) ||
      this.matchSearchTerm(prod.simNumber, lowerCaseSearchTerm)
      // Add other conditions for additional properties you want to filter
    );

    return filteredProducts.map(prod => ({
      ...prod,
      serialNumber: this.highlightMatch(prod.serialNumber, lowerCaseSearchTerm) as string,
      simNumber: this.highlightMatch(prod.simNumber, lowerCaseSearchTerm) as string,
      // Add other properties you want to highlight
    }));
  }

  private matchSearchTerm(text: string | undefined, searchTerm: string): boolean {
    if (!text) {
      return false;
    }
    return text.toLowerCase().includes(searchTerm);
  }

  private highlightMatch(text: string | undefined, searchTerm: string): string | SafeHtml {
    if (!text) {
      return text || '';
    }

    const lowerCaseText = text.toLowerCase();
    const index = lowerCaseText.indexOf(searchTerm);

    if (index !== -1) {
      const highlightedText = text.substring(index, index + searchTerm.length);
      const remainingText = text.substring(index + searchTerm.length);
  
      const highlightedHtml = `
        <span style="background-color: yellow; font-weight: bold;">${highlightedText}</span>${remainingText}
      `;
  
      return this.sanitizer.bypassSecurityTrustHtml(highlightedHtml);
    }

    return text;
  }
}
