import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { CreateSale } from '../Interfaces/create-sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private urlEndpoint: string = environment.endpoint.concat("sale");

  constructor(private http: HttpClient) { }

  GetHistory (): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${ this.urlEndpoint }/history`)
  }

  GetReport (): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${ this.urlEndpoint }/report`)
  }

  Create (request: CreateSale) : Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${ this.urlEndpoint }`, request)
  }
}
