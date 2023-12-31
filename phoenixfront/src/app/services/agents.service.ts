import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Userdto } from '../models/agents/Userdto';
import { Observable, catchError, throwError } from 'rxjs';
import { Clientdto } from '../models/agents/Clientdto';
import { Campaigndto } from '../models/agents/Campaigndto';

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

updatePassword(username: string, newPassword: string): Observable<any> {
  const url = `${this.apiUrl}/updatePassword/${username}`;
  const params = new HttpParams().set('newPassword', newPassword);
  return this.http.put(url, null, { params });
}

updateUser(username: string, userdto: Userdto): Observable<Userdto> {
  return this.http.put<Userdto>(this.apiUrl + '/updateUser/'+ username , userdto)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

addClient(clientdto: Clientdto): Observable<Clientdto> {
  return this.http.post<Clientdto>(this.apiUrl + '/addClient', clientdto)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

addCampaign(campaigndto: Campaigndto): Observable<Campaigndto> {
  return this.http.post<Campaigndto>(this.apiUrl + '/addCampaign', campaigndto)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

getCampaigns(): Observable<Campaigndto[]> {
  return this.http.get<Campaigndto[]>(this.apiUrl + '/getCampaigns')
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

getClients(): Observable<Clientdto[]> {
  return this.http.get<Clientdto[]>(this.apiUrl + '/getClients')
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

}
