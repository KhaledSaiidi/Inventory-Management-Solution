import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stockdto } from '../models/inventory/Stock';
import { Observable, catchError, throwError } from 'rxjs';
import { Productdto } from '../models/inventory/ProductDto';

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

}