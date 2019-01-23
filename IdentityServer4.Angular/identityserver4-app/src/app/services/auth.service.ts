import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { UserManager } from 'oidc-client';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private isAuthenticatedSubject: ReplaySubject<boolean>;

  userManager: UserManager;
  userName: string;
  token: string;

  constructor() {
    this.userManager = new UserManager({
      authority: environment.issuer,
      client_id: 'Angular',
      scope: 'openid profile api',
      response_type: 'id_token token',
      loadUserInfo: true,
      automaticSilentRenew: true,
      redirect_uri: window.location.origin + '/assets/login-callback.html',
      silent_redirect_uri: window.location.origin + '/assets/silent-renew.html',
      post_logout_redirect_uri: window.location.origin
    });
  }

  isAuthenticated(): Observable<boolean> {
    if (!this.isAuthenticatedSubject) {
      this.isAuthenticatedSubject = new ReplaySubject();
      this.userManager.getUser().then(user => {
        if (user) {
          this.userName = user.profile.name;
          this.token = user.access_token;
          this.isAuthenticatedSubject.next(true);
        } else {
          this.isAuthenticatedSubject.next(false);
        }
      });
    }

    return this.isAuthenticatedSubject.asObservable();
  }

  login(): void {
    this.userManager.signinRedirect();
  }

  logout(): void {
    this.userManager.signoutRedirect();
  }

}
