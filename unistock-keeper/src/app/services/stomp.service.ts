import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StompService {

  socket = new SockJS(environment.url + '/notification/notif-websocket');
  stompClient = Stomp.over(this.socket);

  subscribe(topic: string, callback: any): void {
    const connected: boolean = this.stompClient.connected;
    if(connected) {
      this.subscribeToTopic(topic, callback);
      return;
    }

    this.stompClient.connect({}, (): any => {
      this.subscribeToTopic(topic, callback);
    });
  }


  private subscribeToTopic(topic: string, callback: any): void {
      this.stompClient.subscribe(topic, (): any => {
        callback();
      });
  } 

}
