import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  {
  constructor(private authService: AuthService) {}
  username!: string;
  password!: string;
  errorMessage!: string;
  keycloak: any;
  async login() {
     await this.authService.login(this.username, this.password);
  }


}

