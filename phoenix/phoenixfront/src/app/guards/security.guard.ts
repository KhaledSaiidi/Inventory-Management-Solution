import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override router: Router,
    protected keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    console.log('isAccessAllowed called');
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin
      });
      return false;
    }

    const requiredRoles = route.data['roles'];

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const userRoles = this.keycloak.getUserRoles();
    const hasRequiredRole = requiredRoles.some((role: string) => userRoles.includes(role));

    if (!hasRequiredRole) {
      this.router.navigate(['unauthorized']); 
      return false;
    }
    return true;
  }
  
}
