import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  readonly apiUrl = "http://localhost:9000/stock";
  constructor(private http: HttpClient) { }
}
