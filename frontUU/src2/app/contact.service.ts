import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http:HttpClient) { }
  private emailApiUrl = 'http://localhost:3000/send-email';

  sendEmail(data: any): Observable<string> {
    return this.http.post(this.emailApiUrl, data, { responseType: 'text' });
  }

}
