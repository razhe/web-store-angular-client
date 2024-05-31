import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { CreateUpdateUser } from '../Interfaces/create-update-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private urlEndpoint: string = environment.endpoint.concat("user");

  constructor(private http:HttpClient) { }

  list (): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${ this.urlEndpoint }`)
  }

  Create (request: CreateUpdateUser) : Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${ this.urlEndpoint }`, request)
  }

  Update (request: CreateUpdateUser, userId: string) : Observable<ResponseApi> {
    //const params = new HttpParams().set('userId', userId)
    return this.http.put<ResponseApi>(`${ this.urlEndpoint }/${userId}`, request)
  }

  Remove (userId: string) : Observable<ResponseApi> {
    //const params = new HttpParams().set('userId', userId)
    return this.http.delete<ResponseApi>(`${ this.urlEndpoint }/${userId}`)
  }
}
