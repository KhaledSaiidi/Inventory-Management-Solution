import { Injectable } from "@angular/core";
import { SecurityService } from "../services/security.service";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class UserDetailsGuard implements CanActivate {
    constructor(private securityService: SecurityService, private router: Router) {}
  
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const usernameParam = route.paramMap.get('id');

        const usernameQuery = route.queryParamMap.get('id');

        const username = usernameQuery || usernameParam;


        if (username === this.securityService.profile?.username) {
          return true;
        } else {
          console.log("unauthorized");
          return false;
        }
    }
  }
  