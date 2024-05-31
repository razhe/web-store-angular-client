import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { CreateUpdateProduct } from '../Interfaces/create-update-product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private urlEndpoint: string = environment.endpoint.concat("product");

  constructor(private http: HttpClient) { }

  list (): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${ this.urlEndpoint }`)
  }

  Create (request: CreateUpdateProduct) : Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${ this.urlEndpoint }`, request)
  }

  Update (request: CreateUpdateProduct, productId: string) : Observable<ResponseApi> {
    //const params = new HttpParams().set('productId', productId)
    return this.http.put<ResponseApi>(`${ this.urlEndpoint }/${productId}`, request)
  }

  Remove (productId: string) : Observable<ResponseApi> {
    //const params = new HttpParams().set('productId', productId)
    return this.http.delete<ResponseApi>(`${ this.urlEndpoint }/${productId}`)
  }
}
