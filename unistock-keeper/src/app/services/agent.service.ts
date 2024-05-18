import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  readonly apiUrl = "http://localhost:9000/people";
  constructor(private http: HttpClient) { }


  getuserbycode(code: string){
    return this.http.get(this.apiUrl + '/userdetails/' + code)
    .pipe(
      catchError((error) => {
        if (error.status === 200 && error.error instanceof ErrorEvent) {
          return of([]);
        } else {
        console.error('An error occurred:', error);
        return throwError(error);}
      })
    );
  
  }
  

  getagents() {
    return this.http.get(this.apiUrl + '/allusers')
    .pipe(
      catchError((error) => {
        if (error.status === 200 && error.error instanceof ErrorEvent) {
          return of([]);
        } else {
        console.error('An error occurred:', error);
        return throwError(error); }
      })
    );
  }
}
