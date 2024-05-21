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

   
  
    console.log('isAccessAllowed called');
  
    if (!this.authenticated) {
      window.location.href = '/login';
      console.log('no authentification');
      return false;
    }

    const requiredRoles = route.data['roles'];

    if (!requiredRoles || requiredRoles.length === 0) {
      console.log('no required role');
      this.authenticated = true;
      return true;
    }
    const userRoles = this.keycloak.getUserRoles();
    const hasRequiredRole = requiredRoles.some((role: string) => userRoles.includes(role));

    if (!hasRequiredRole) {
      this.router.navigate(['/']);
      console.log('required role');
      return false;
    }
    console.log('nothing');
    this.authenticated = true;
    return true;
  }
}