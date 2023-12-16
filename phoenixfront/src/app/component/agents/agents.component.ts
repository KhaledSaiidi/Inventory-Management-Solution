import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit {
  showColMd4 = false;
  toggleColMd4() {
    this.showColMd4 = !this.showColMd4;
  }
  ngOnInit(): void{
  }
}
