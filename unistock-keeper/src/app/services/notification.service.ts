import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ReclamationDto } from '../models/notifications/ReclamationDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly apiUrl = environment.url + "/notification";

  constructor(private http: HttpClient) { }
  getNewReclamations(receiver: string): Observable<ReclamationDto[]> {
    return this.http.get<ReclamationDto[]>(`${this.apiUrl}/getNewReclamations?receiver=${receiver}`);
  }

  getAllReclamationsForReceiver(username: string): Observable<ReclamationDto[]> {
    return this.http.get<ReclamationDto[]>(`${this.apiUrl}/getAllReclamationsForReceiver?username=${username}`);
  }

  getAllReclamationsForsender(username: string): Observable<ReclamationDto[]> {
    return this.http.get<ReclamationDto[]>(`${this.apiUrl}/getAllReclamationsForsender?username=${username}`);
  }


  terminateNotification(username: string, reclamationDtos: ReclamationDto[]): Observable<number> {
    return this.http.put<number>(this.apiUrl + '/terminateNotification/'+ username, reclamationDtos)
    .pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
  }

  addReclamation(notification: ReclamationDto): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/addReclamation', notification)
    .pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
  }
}

