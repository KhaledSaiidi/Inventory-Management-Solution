import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:9999';

  constructor(private http: HttpClient) { }

  updateValues(newValues: any): Observable<any> {
    const url = `${this.apiUrl}/updateValues`;
    return this.http.post(url, newValues);
  }
}
