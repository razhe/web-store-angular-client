import { Component } from '@angular/core';
import { LoginRequest } from '../../Interfaces/login-request';
import { AccountService } from '../../Services/account.service';
import { ResponseApi } from '../../Interfaces/response-api';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetsService } from '../../Utils/assets.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm:FormGroup;
  showPassword: boolean = false;
  showLoading: boolean = false;

  loginRequest: LoginRequest = {
    email: "",
    password: "",
    clientId: "client-app",
    clientSecret: "kvLuU1uWTHyXGdAMWX8aYWKA1tkQa1LZsAyWy6yB",
    grantType: 0
  };

  constructor(
    private accountService: AccountService,
    private router:Router,
    private fb:FormBuilder,
    private assetService: AssetsService
  ) {
    this.loginForm = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  login() {
    this.showLoading = true;

    this.loginRequest.email = this.loginForm.value.email;
    this.loginRequest.password = this.loginForm.value.password;

    this.accountService.login(this.loginRequest).subscribe({
      next: (response:ResponseApi) => {
        localStorage.setItem('accessTokenObj', JSON.stringify(response.data));
        this.router.navigateByUrl('/pages/dashboard')
        this.assetService.showAlert(response.message, 'Correcto!')
      },
      complete: () => {
        this.showLoading = false;
      },
      error: (response:any) => {
        this.assetService.showAlert(
          response.error.message ??
          "Ha ocurrido un error inesperado, intente nuevamente. Si persiste comuniquese con sorporte", "Oops!")

        this.showLoading = false;
      }
    })
  }
}
