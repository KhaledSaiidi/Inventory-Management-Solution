import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stockdto } from '../models/inventory/Stock';
import { Observable, Observer, catchError, throwError } from 'rxjs';
import { Productdto } from '../models/inventory/ProductDto';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  readonly apiUrl = "http://localhost:9000/stock";
  constructor(private http: HttpClient) { }

  addStock(stockDto: Stockdto, campaignReference: string): Observable<number> {
    return this.http.post<number>(this.apiUrl + '/addStock/'+ campaignReference, stockDto)
    .pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
}


getStockWithCampaigns(): Observable<Stockdto[]> {
  return this.http.get<Stockdto[]>(this.apiUrl + '/getStocksWithTheirCampaigns')
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

getStockByreference(reference: string): Observable<Stockdto> {
  return this.http.get<Stockdto>(this.apiUrl + '/getStockByReference/' + reference)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

addProduct(productDto: Productdto): Observable<number> {
  return this.http.post<number>(this.apiUrl + '/addProduct', productDto)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

getProductsByStockReference(stockreference: string): Observable<Productdto[]> {
  return this.http.get<Productdto[]>(this.apiUrl + '/getProductsByStockReference/' + stockreference)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}


updateProduct(serialNumber: string, productdto: Productdto): Observable<Productdto> {
  return this.http.put<Productdto>(this.apiUrl + '/updateProduct/'+ serialNumber , productdto)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}


getProductByserialNumber(serialNumber: string): Observable<Productdto> {
  return this.http.get<Productdto>(this.apiUrl + '/getProductByserialNumber/' + serialNumber)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

uploadFile(file: File): Observable<number> {
  const formData: FormData = new FormData();
  formData.append('file', file, file.name);

  return this.http.post<number>(this.apiUrl + "/uploadcsv", formData);
}

excelToCsv(excelFile: File): Observable<File> {
  return new Observable((observer: Observer<File>) => {
    const reader: FileReader = new FileReader();

    reader.onload = (event: any) => {
      const data: string | ArrayBuffer = event.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'binary' });

      // Assume the first sheet is the one you want to convert
      const firstSheetName = workbook.SheetNames[0];
      const csvData: string = XLSX.utils.sheet_to_csv(workbook.Sheets[firstSheetName]);

      const blob = new Blob([csvData], { type: 'text/csv' });
      const csvFile: File = new File([blob], 'converted.csv', { type: 'text/csv' });

      observer.next(csvFile);
      observer.complete();
    };

    reader.onerror = (event: ProgressEvent) => {
      observer.error(event);
    };

    reader.readAsBinaryString(excelFile);
  });
}


}
