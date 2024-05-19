import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard implements CanActivate {
  constructor(
    protected override router: Router,
    protected keycloak: KeycloakService,
    private authService: AuthService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const token = localStorage.getItem('kc_token');
    const refreshToken = localStorage.getItem('kc_refreshToken');
  
    console.log('isAccessAllowed called');

    if (!this.authenticated && token && refreshToken) {
      const keycloakInstance = this.keycloak.getKeycloakInstance();
      keycloakInstance.token = token;
      keycloakInstance.refreshToken = refreshToken;
      keycloakInstance.tokenParsed = jwtDecode(token);
      keycloakInstance.authenticated = true;
      await this.keycloak.loadUserProfile();
      this.authenticated = true;
    }
  
    if (!this.authenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRoles = route.data['roles'];

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const userRoles = this.keycloak.getUserRoles();
    const hasRequiredRole = requiredRoles.some((role: string) => userRoles.includes(role));

    if (!hasRequiredRole) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}