import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Userdto } from '../models/agents/Userdto';
import { Observable, catchError, of, throwError } from 'rxjs';
import { Clientdto } from '../models/agents/Clientdto';
import { Campaigndto } from '../models/agents/Campaigndto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentsService {

  readonly apiUrl = environment.url + "/people";
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
      if (error.status === 200 && error.error instanceof ErrorEvent) {
        return of([]);
      } else {
      console.error('An error occurred:', error);
      return throwError(error); }
    })
  );
}
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
      if (error.status === 200 && error.error instanceof ErrorEvent) {
        return of([]);
      } else {
      console.error('An error occurred:', error);
      return throwError(error);}
    })
  );
}

getClients(): Observable<Clientdto[]> {
  return this.http.get<Clientdto[]>(this.apiUrl + '/getClients')
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

getclientbycompanyName(companyName: string){
  return this.http.get(this.apiUrl + '/getClientByName/' + companyName)
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

updateClient(reference: string, clientdto: Clientdto): Observable<Clientdto> {
  return this.http.put<Clientdto>(this.apiUrl + '/updateClient/'+ reference , clientdto)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

updateCampaign(reference: string, campaigndto: Campaigndto): Observable<Campaigndto> {
  return this.http.put<Campaigndto>(this.apiUrl + '/updateCampaign/'+ reference , campaigndto)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}

getcampaignbyreference(reference: string){
  return this.http.get(this.apiUrl + '/getCampaignByReference/' + reference)
  .pipe(
    catchError((error) => {
      if (error.status === 200 && error.error instanceof ErrorEvent) {
        return of([]);
      } else {
      console.error('An error occurred:', error);
      return throwError(error);
      }
    })
  );
}

archiveCampaign(campaignReference: string): Observable<any> {
  return this.http.delete(this.apiUrl + '/archive/' + campaignReference)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );

}

getArchivedCampaigns(): Observable<Campaigndto[]> {
  return this.http.get<Campaigndto[]>(this.apiUrl + '/getCampaignsarchived')
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

deleteArchiveCampaign(campaignref: string): Observable<any> {
  return this.http.delete(this.apiUrl + '/deletearchivecampaign/' + campaignref)
  .pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );

}

getCampaignStatistics(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/statistics');
}

getArchivedCampaign(ref: string): Observable<Campaigndto> {
  return this.http.get<Campaigndto>(`${this.apiUrl}/getArchivedCampaign/${ref}`).pipe(
    catchError((error) => {
      console.error('An error occurred:', error);
      return throwError(error);
    })
  );
}


}
