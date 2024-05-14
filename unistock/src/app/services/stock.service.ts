import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Productdto } from '../models/inventory/ProductDto';
import { SoldProductDto } from '../models/inventory/SoldProductDto';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  readonly apiUrl = "http://localhost:9000/stock";
  constructor(private http: HttpClient) { }

  getUserStat(username: string): Observable<number[]> {
    return this.http.get<number[]>(this.apiUrl + '/getUserStat/' + username)
    .pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
  }
  

  getThelast4ReturnedProdsByusername(username: string): Observable<Productdto[]> {
    return this.http.get<Productdto[]>(this.apiUrl + '/getThelast4ReturnedProdsByusername/' + username)
    .pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
  }
  
  getThelast4SoldProdsByusername(username: string): Observable<SoldProductDto[]> {
    return this.http.get<SoldProductDto[]>(this.apiUrl + '/getThelast4SoldProdsByusername/' + username)
    .pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
  }
  

  getStocksByStocksReferences(): Observable<String[]> {
    const apiUrl = this.apiUrl + '/getStocksByStocksReferences';
    return this.http.get<String[]>(apiUrl)
      .pipe(
        catchError((error) => {
          console.error('An error occurred:', error);
          return throwError(error);
        })
      );
  }

  getProductsInPossession(username: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/productsInPossession/${username}`);
  }
  
}
