import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest } from '../Interfaces/login-request';
import { RefreshTokenRequest } from '../Interfaces/refresh-token-request';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  /* ¿Qué es un subject?
  Un Subject es una clase que actúa como un observable y un observador al mismo tiempo.
  Esto significa que puedes suscribirte a un Subject como lo harías con un observable,
  pero también puedes emitir valores a través de él */
  public $refreshToken = new Subject<RefreshTokenRequest>;
  public $refreshTokenRefreshed = new Subject<string>;

  private urlEndpoint: string = environment.endpoint.concat("account");

  constructor(private http: HttpClient, private router: Router) {
    /* Nota
    Nos suscribimos al Subject lo cual ejecutara el metodo refresh token cuando
    emitamos un valor a traves de él.
    */
    this.$refreshToken.subscribe((response: RefreshTokenRequest) => {
      this.refreshToken(response);
    })
  }

  login(request: LoginRequest) : Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${ this.urlEndpoint }/login`, request)
  }

  refreshToken(request: RefreshTokenRequest) {
    this.http.post<ResponseApi>(`${ this.urlEndpoint }/refreshtoken`, request)
    .subscribe((response: ResponseApi) => {

      localStorage.setItem('accessTokenObj', JSON.stringify(response.data));

      // Emitimos que ya se refrescó el token
      this.$refreshTokenRefreshed.next(response.data.accessToken);
    })
  }

  isTokenExpired(token: string) : boolean {
    let decodedJWT: any = jwtDecode(token);
    let expirationTime: number = decodedJWT.exp;
    let currentTimestamp: number = Math.floor(Date.now() / 1000);

    return expirationTime < currentTimestamp;
  }

  getUserSession() : any {
    const accessToken = localStorage.getItem('accessTokenObj')
    let decodedToken: any = jwtDecode(accessToken!);

    const userSessionData: any = {
      'name': decodedToken.Name,
      'role': decodedToken.Role,
      'email': decodedToken.Email,
    }

    return userSessionData;
  }

  removeUserSession() : void {
    localStorage.removeItem('accessTokenObj');
    this.router.navigateByUrl('login');
  }
}
