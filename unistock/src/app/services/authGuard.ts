 import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { SecurityService } from './security.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private securityService: SecurityService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.securityService.hasValidAccessToken$.pipe(
      map(hasValidAccessToken => {
        if (!hasValidAccessToken) {
          this.securityService.login();
          return false;
        }
        return true;
      })
    );
  }
}
