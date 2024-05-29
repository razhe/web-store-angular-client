import { Component } from '@angular/core';
import { LoginRequest } from '../../Interfaces/login-request';
import { AccountService } from '../../Services/account.service';
import { ResponseApi } from '../../Interfaces/response-api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginObj: LoginRequest = {
    email: undefined,
    password: undefined,
    clientId: "client-app",
    clientSecret: "kvLuU1uWTHyXGdAMWX8aYWKA1tkQa1LZsAyWy6yB",
    grantType: 0
  };

  constructor(private accountService: AccountService, private router:Router
  ) {}

  login() {
    // debugger;
    this.accountService.login(this.loginObj).subscribe((response:ResponseApi) => {
      if (response.isSuccess) {
        localStorage.setItem('accessTokenObj', JSON.stringify(response.data));
        this.router.navigateByUrl('/pages/dashboard')
      }
    })
  }
}
