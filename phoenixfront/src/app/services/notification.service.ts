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

  getReclamations(): Observable<ReclamationDto[]> {
    const apiUrl = this.apiUrl + '/getReclamations';
    return this.http.get<ReclamationDto[]>(apiUrl)
      .pipe(
        catchError((error) => {
          console.error('An error occurred:', error);
          return throwError(error);
        })
      );
  }
}
