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
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin
      });
      return false;
    }

    // Get the roles required from the route.
    const requiredRoles = route.data['roles'];

    // Allow the user to proceed if no additional roles are required to access the route.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const userRoles = this.keycloak.getUserRoles();
    const hasRequiredRole = requiredRoles.some((role: string) => userRoles.includes(role));

    if (!hasRequiredRole) {
      this.router.navigate(['unauthorized']); // Replace 'unauthorized' with your desired unauthorized route
      return false;
    }
    return true;
  }
}
