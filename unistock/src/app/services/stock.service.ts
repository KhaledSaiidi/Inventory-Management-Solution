import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

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
  
}
