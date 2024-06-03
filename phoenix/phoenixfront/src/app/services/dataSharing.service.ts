import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private checkedBoxProdsSource = new BehaviorSubject<string[]>([]);
  checkedBoxProds$ = this.checkedBoxProdsSource.asObservable();

  updatecheckedBoxProds(checkedBoxProds: string[]): void {
    this.checkedBoxProdsSource.next(checkedBoxProds);
  }
}
