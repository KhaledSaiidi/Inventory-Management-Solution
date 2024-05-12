import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifsharedService {

  private notificationTerminatedSource = new Subject<void>();
  notificationTerminated$ = this.notificationTerminatedSource.asObservable();

  notifyNotificationTerminated() {
    this.notificationTerminatedSource.next();
  }
}
