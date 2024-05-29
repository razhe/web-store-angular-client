import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AccountService } from '../Services/account.service';
import { RefreshTokenRequest } from '../Interfaces/refresh-token-request';
import { Router } from '@angular/router';

export const accessTokenInterceptor: HttpInterceptorFn = (request, next) => {

  const accountService = inject(AccountService);
  const router = inject(Router);

  let accessTokenObj: any;
  let accessToken: string = "";

  const accessTokenStrObj = localStorage.getItem('accessTokenObj')

  if (accessTokenStrObj) {
    accessTokenObj = JSON.parse(accessTokenStrObj);
    accessToken = accessTokenObj.accessToken;

    // Revisamos si el token sigue vigente
    if (accountService.isTokenExpired(accessTokenObj.accessToken)) {
      // Aquí se puede añadir pop-up para preguntar si desea refrescar la sesión

      // Emitimos el Subject de account service para refrescar el token
      let refreshTokenRequest: RefreshTokenRequest = {
        expiredToken: accessTokenObj.accessToken,
        refreshToken: accessTokenObj.refreshToken
      }

      accountService.$refreshToken.next(refreshTokenRequest);

      accountService.$refreshTokenRefreshed.subscribe((response: string) => {
        accessToken = response
      })
    }
  }

  if (accessToken !== "") {
    const cloneRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
        }
    })

    return next(cloneRequest);
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        router.navigateByUrl('login')
      }
      return throwError(error);
    })
  );
};
