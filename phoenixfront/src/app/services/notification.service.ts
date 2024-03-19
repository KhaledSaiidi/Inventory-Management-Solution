import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ReclamationDto } from '../models/notifications/ReclamationDto';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly apiUrl = "http://localhost:9000/notification";

  constructor(private http: HttpClient) { }


  getReclamations(receiver: string): Observable<ReclamationDto[]> {
    return this.http.get<ReclamationDto[]>(`${this.apiUrl}/getReclamations?receiver=${receiver}`);
  }


  terminateNotification(username: string, reclamations: ReclamationDto[]): Observable<number> {
    return this.http.put<number>(this.apiUrl + '/terminateNotification/'+ username, reclamations)
    .pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
  }
}
