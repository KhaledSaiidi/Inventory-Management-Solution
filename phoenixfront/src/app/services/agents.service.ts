import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Userdto } from '../models/agents/Userdto';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentsService {

  readonly apiUrl = "http://localhost:9000/people";
  constructor(private http: HttpClient) { }

  addAgent(userdto: Userdto): Observable<number> {
    return this.http.post<number>(this.apiUrl + '/adduserdto', userdto)
    .pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
}

getagents() {
  return this.http.get(this.apiUrl + '/allusers')
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}
getuserbycode(code: string){
  return this.http.get(this.apiUrl + '/userdetails/' + code)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );

}

deleteUser(username: string): Observable<any> {
  return this.http.delete(this.apiUrl + '/deleteUser/' + username)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );

}


}
