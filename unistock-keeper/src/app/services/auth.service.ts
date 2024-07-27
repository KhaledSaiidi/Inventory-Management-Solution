import {  Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';
import {  KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { KeycloakResponse } from '../models/KeycloakResponse';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public profile?: KeycloakProfile;
  constructor(public kcService: KeycloakService, private http: HttpClient,
    private router: Router
  ){
    this.kcService.keycloakEvents$.subscribe({
      next: (event) => {
        if (event.type === KeycloakEventType.OnAuthLogout ) {
          this.onSessionEnd();
        } 
      }
    });
  }

  private onSessionEnd() {
    const keycloakInstance = this.kcService.getKeycloakInstance();
    if(keycloakInstance) {
      keycloakInstance.clearToken();
      keycloakInstance.authenticated = false;  
    }
    this.profile = undefined;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }


  async refreshAccessToken(): Promise<void> {
    const keycloakInstance = this.kcService.getKeycloakInstance();
    keycloakInstance.onTokenExpired = async () => {
      try {
        await this.kcService.updateToken();
        console.log("Token updated successfully : " + keycloakInstance.token);
        this.saveTokens();
      } catch (error) {
        console.error("Failed to update token", error);
        this.onSessionEnd();
      }
    };      
  }
  
  async login(username: string, password: string): Promise<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const encodedPassword = encodeURIComponent(password);

    const body = `client_id=${environment.keycloak.clientId}&grant_type=password&username=${username}&password=${encodedPassword}`;
    const url = `${environment.keycloak.url}/realms/${environment.keycloak.realm}/protocol/openid-connect/token`;

    try {
      const response  = await this.http.post(url, body, { headers }).toPromise() as KeycloakResponse;
      const token = response.access_token;
      const refreshToken = response.refresh_token;
      const expiresin = response.expires_in;

      const keycloakInstance = this.kcService.getKeycloakInstance();
      if (keycloakInstance) {
        keycloakInstance.token = token;
        keycloakInstance.refreshToken = refreshToken;
        keycloakInstance.tokenParsed = jwtDecode(token) as KeycloakTokenParsed;
        keycloakInstance.authenticated = true;
        console.log("keycloakInstancetoken : " + keycloakInstance.token);
        console.log("keycloakInstancerefreshToken : " + keycloakInstance.refreshToken);
        console.log("expire in  : " + expiresin);
        const userProfile: KeycloakProfile = await this.kcService.loadUserProfile();
        this.profile = userProfile;
        this.router.navigate(['/home']);
        keycloakInstance.onTokenExpired = async () => {
          try {
            await this.kcService.updateToken();
            console.log("Token updated successfully");
          } catch (error) {
            console.error("Failed to update token", error);
            this.onSessionEnd();
          }
        };   
        this.saveTokens();   
      } else {
        console.error('Failed to get Keycloak instance during login');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  }

  private saveTokens(): void {
    const keycloakInstance = this.kcService.getKeycloakInstance();
    localStorage.setItem('token', keycloakInstance.token || '');
    localStorage.setItem('refreshToken', keycloakInstance.refreshToken || '');
  }

  private getUserRoles(): string[] {
    const keycloakInstance = this.kcService.getKeycloakInstance();
    if (!keycloakInstance || !keycloakInstance.tokenParsed) {
      console.log("!keycloakInstance || !keycloakInstance.tokenParsed");
      return [];
    }

    const realmAccess = keycloakInstance.tokenParsed['realm_access'];
    let roles: string[] = [];

    if (realmAccess && realmAccess.roles) {
      roles = realmAccess.roles;
      console.log(roles);
    } else {
      console.log("empty");
    }

    return roles;
  }

  public hasRoleIn(roles:string[]): boolean{
      let userRoles = this.getUserRoles();
      for(let role of roles){
          if(userRoles.includes(role)) return true;
      } return false;
      }

      async logout() {
        const keycloakInstance = this.kcService.getKeycloakInstance();
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
        keycloakInstance.clearToken();
        keycloakInstance.authenticated = false;
        this.profile = undefined;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');     
        window.location.href = '/login';
      }
    
  }