import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { LoginAuthorization } from '../Interfaces/login-authorization';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private urlEndpoint: string = environment.endpoint.concat("account");

  constructor(private http:HttpClient) {
  }

  login(request: LoginAuthorization) : Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${ this.urlEndpoint }/login`, request)
  }

  isJWTExpired(token: string) : boolean {
    let decodedJWT: any = jwtDecode(token);
    let expirationTime: number = decodedJWT.exp;
    let currentTimestamp: number = Math.floor(Date.now() / 1000);

    return expirationTime < currentTimestamp;
  }
}
