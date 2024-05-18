import { Inject, Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OAuthService, AuthConfig, UrlHelperService, NullValidationHandler, DefaultHashHandler, SystemDateTimeProvider, OAuthErrorEvent, OAuthLogger } from 'angular-oauth2-oidc';
import { DOCUMENT } from '@angular/common';
import { KeycloakResponse } from '../models/KeycloakResponse';
import { Router } from '@angular/router';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public profile?: KeycloakProfile;
  constructor(public kcService: KeycloakService, private http: HttpClient,
    private router: Router
  ){}
  
  async login(username: string, password: string): Promise<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = `client_id=${environment.keycloak.clientId}&grant_type=password&username=${username}&password=${password}`;

    const url = `${environment.keycloak.url}/realms/${environment.keycloak.realm}/protocol/openid-connect/token`;
    try {
    const response = await this.http.post(url, body, { headers }).toPromise();
    const token = (response as any).access_token;
    const refreshToken = (response as any).refresh_token;

    const keycloakInstance = this.kcService.getKeycloakInstance();
    keycloakInstance.token = token;
    keycloakInstance.refreshToken = refreshToken;
    keycloakInstance.tokenParsed = jwtDecode(token);
    keycloakInstance.authenticated = true;
    const userProfile: KeycloakProfile = await this.kcService.loadUserProfile();
    this.profile = userProfile;
    this.router.navigate(['/home']);
    this.kcService.updateToken(30);
  } catch (error) {
    console.error('Login failed', error);
  }

  }


  async logout() {
    const keycloakInstance = this.kcService.getKeycloakInstance();
    
//    const redirectUri = window.location.origin + '/login';
    const logoutUrl = `${keycloakInstance.authServerUrl}/realms/${keycloakInstance.realm}/protocol/openid-connect/logout`;
if(keycloakInstance.refreshToken) {
    try {
        const params = new URLSearchParams();
        params.set('client_id', environment.keycloak.clientId);
        params.set('refresh_token', keycloakInstance.refreshToken);
        console.log(params.toString());
        await this.http.post(logoutUrl, params.toString(), {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
          })
        }).toPromise();
      } catch (error) {
        console.error('Failed to logout from Keycloak', error);
      }
    }
    
/* try {
  await this.kcService.logout(redirectUri);
} catch (error) {
  console.error('Logout failed', error);
} */

    keycloakInstance.clearToken();
    keycloakInstance.authenticated = false;
    this.profile = undefined;
    this.router.navigate(['/login']); 
  }

  public hasRoleIn(roles:string[]): boolean{
      let userRoles = this.kcService.getUserRoles();
      for(let role of roles){
          if(userRoles.includes(role)) return true;
      } return false;
      }
  }