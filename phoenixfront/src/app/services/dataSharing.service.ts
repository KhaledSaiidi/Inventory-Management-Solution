import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private uncheckedProdsSource = new BehaviorSubject<string[]>([]);
  uncheckedProds$ = this.uncheckedProdsSource.asObservable();

  updateUncheckedProds(uncheckedProds: string[]): void {
    this.uncheckedProdsSource.next(uncheckedProds);
  }
}
