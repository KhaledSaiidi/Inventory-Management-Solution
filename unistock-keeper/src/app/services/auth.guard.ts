import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

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