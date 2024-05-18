import { Component, OnInit } from '@angular/core';
import { SecurityService } from './services/security.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private sec: SecurityService
  ) { }

  ngOnInit(): void {
    this.sec.init();
  }
}
