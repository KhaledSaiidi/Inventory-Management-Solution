import {  Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { KeycloakProfile } from 'keycloak-js';
import {  KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';


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
        if (event.type === KeycloakEventType.OnAuthLogout || event.type === KeycloakEventType.OnTokenExpired) {
          this.onSessionEnd();
        } else if(event.type === KeycloakEventType.OnAuthRefreshSuccess) {
          this.updateLocalStorage();
        }
      }
    });
  }
  private updateLocalStorage() {
    const keycloakInstance = this.kcService.getKeycloakInstance();
    if (keycloakInstance) {
      const updatedToken = keycloakInstance.token ?? '';
      const updatedRefreshToken = keycloakInstance.refreshToken ?? '';
      localStorage.setItem('kc_token', updatedToken);
      localStorage.setItem('kc_refreshToken', updatedRefreshToken);
    }
  }

  private onSessionEnd() {
    const keycloakInstance = this.kcService.getKeycloakInstance();
    if(keycloakInstance) {
      keycloakInstance.clearToken();
      keycloakInstance.authenticated = false;  
    }
    this.profile = undefined;
    localStorage.clear();
    this.router.navigate(['/login']);
  }

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

    if (token && refreshToken) {
      localStorage.setItem('kc_token', token);
      localStorage.setItem('kc_refreshToken', refreshToken);
    }
    console.log("token : " + token);
    console.log("refreshToken :" + refreshToken);
    const keycloakInstance = this.kcService.getKeycloakInstance();
    keycloakInstance.token = token;
    keycloakInstance.refreshToken = refreshToken;
    keycloakInstance.tokenParsed = jwtDecode(token);
    keycloakInstance.authenticated = true;
    const userProfile: KeycloakProfile = await this.kcService.loadUserProfile();
    this.profile = userProfile;
    this.router.navigate(['/home']);

    this.kcService.updateToken(30).then(() => {
      localStorage.clear();
      const updatedToken = keycloakInstance.token ?? '';
      const updatedRefreshToken = keycloakInstance.refreshToken ?? '';
      localStorage.setItem('kc_token', updatedToken);
      localStorage.setItem('kc_refreshToken', updatedRefreshToken);
    });
  
      } catch (error) {
    console.error('Login failed', error);
  }

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
        localStorage.clear();
        keycloakInstance.authenticated = false;
        this.profile = undefined;
        this.router.navigate(['/login']); 
      }
    
  }