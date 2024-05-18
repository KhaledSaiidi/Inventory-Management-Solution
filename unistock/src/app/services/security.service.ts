 import { Injectable, NgZone } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { environment as env } from 'src/environments/environment';


@Injectable({providedIn: "root"})
export class SecurityService {
    private _userProfile: any = null;
    public userProfile$ = new BehaviorSubject<any>(this._userProfile);
  
    private _hasValidAccessToken = false;
    public hasValidAccessToken$ = new BehaviorSubject<boolean>(this._hasValidAccessToken);
  
    private _realmRoles: string[] = [];
    public realmRoles$ = new BehaviorSubject<string[]>(this._realmRoles);
  
    constructor(
      private oauthService: OAuthService,
      private zone: NgZone,
      private platform: Platform,
      private activatedRoute: ActivatedRoute,
      private router: Router
    ) {
      this.setupPlatformConfiguration();
    }
  
    private setupPlatformConfiguration(): void {
      if (this.platform.is('ios' || 'android') && this.platform.is('capacitor')) {
        this.configureMobile();
      } else if (this.platform.is('desktop')) {
        this.configureWeb();
      } else {
        alert("This platform is not supported.")
      }
    }
  
    get userProfile(): any {
      return this._userProfile;
    }
  
    set userProfile(value: any) {
      this._userProfile = value;
      this.userProfile$.next(this._userProfile);
    }
  
    get hasValidAccessToken(): boolean {
      return this._hasValidAccessToken;
    }
  
    set hasValidAccessToken(value: boolean) {
      this._hasValidAccessToken = value;
      this.hasValidAccessToken$.next(this._hasValidAccessToken);
    }
  
    get realmRoles(): string[] {
      return this._realmRoles;
    }
  
    set realmRoles(value: string[]) {
      this._realmRoles = value;
      this.realmRoles$.next(this._realmRoles);
    }
  
    init() {
      this.oauthService.loadDiscoveryDocument()
        .then(() => {
          this.hasValidAccessToken = this.oauthService.hasValidAccessToken();
          this.oauthService.tryLogin().then(() => {
            if (this.hasValidAccessToken) {
              this.loadUserProfile();
              this.realmRoles = this.getRealmRoles();
            }
          });
        })
        .catch(console.error);
  
      this.oauthService.events.subscribe(() => {
        this.hasValidAccessToken = this.oauthService.hasValidAccessToken();
      })
    }
  
    private configureWeb(): void {
        let authConfig: AuthConfig = env.auth;
        this.oauthService.configure(authConfig);
        this.oauthService.setupAutomaticSilentRefresh();
      }
    
      private configureMobile(): void {
        let authConfig: AuthConfig = env.auth;
    
      authConfig.redirectUri = 'edgeflareapp://callback'
      this.oauthService.configure(authConfig);
      this.oauthService.setupAutomaticSilentRefresh();
  
      App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        let url: URL | any = new URL(event.url);
        if (url.host != "callback") {
          return;
        }
  
        this.zone.run(() => {
          const queryParams: Params = {};
          for (const [key, value] of url.searchParams.entries()) {
            queryParams[key] = value;
          }
  
          this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge',
          })
            .then(() => {
              this.oauthService.tryLogin().then(() => {
                if (this.hasValidAccessToken) {
                  this.loadUserProfile();
                  this.realmRoles = this.getRealmRoles();
                }
              })
            })
            .catch(console.error);
        });
      });
    }
  
    public getRealmRoles(): string[] {
      let idClaims = this.oauthService.getIdentityClaims()
      if (!idClaims) {
        console.error("Couldn't get identity claims, make sure the user is signed in.")
        return [];
      }
  
      return idClaims["realm_roles"] ?? [];
    }
  
    public loadUserProfile(): void {
      this.oauthService.loadUserProfile()
        .then(profile => {
          this.userProfile = profile;
        })
        .catch(console.error);
    }
  
    public login(): void {
      this.oauthService.loadDiscoveryDocumentAndLogin()
        .then(() => {
          this.hasValidAccessToken = this.oauthService.hasValidAccessToken();
        })
        .catch(console.error);
    }
  
    public logout(): void {
      this.oauthService.revokeTokenAndLogout()
        .then(() => {
          this.userProfile = null;
          this.realmRoles = [];
        })
        .catch(console.error);
    }
  }
  