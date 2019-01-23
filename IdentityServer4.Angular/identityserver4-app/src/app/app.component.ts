import { Component } from '@angular/core';

import { AuthService } from './services/auth.service';
import { ValuesService } from './services/values.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  isAuthenticated = false;
  userName: string;
  values: string[];

  constructor(
    private authService: AuthService,
    private valuesService: ValuesService
  ) {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      if (!this.isAuthenticated) {
        authService.login();
      } else {
        this.userName = this.authService.userName;
        this.valuesService.getValues().subscribe(values => this.values = values);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
