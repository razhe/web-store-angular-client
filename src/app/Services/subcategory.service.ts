import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { CreateUpdateSubcategory } from '../Interfaces/create-update-subcategory';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  private urlEndpoint: string = environment.endpoint.concat("subcategory");

  constructor(private http: HttpClient) { }

  list (): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${ this.urlEndpoint }`)
  }

  Create (request: CreateUpdateSubcategory) : Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${ this.urlEndpoint }`, request)
  }

  Update (request: CreateUpdateSubcategory, subcategoryId: number) : Observable<ResponseApi> {
    const params = new HttpParams().set('subcategoryId', subcategoryId)
    return this.http.put<ResponseApi>(`${ this.urlEndpoint }/${subcategoryId}`, request)
  }

  Remove (subcategoryId: number) : Observable<ResponseApi> {
    const params = new HttpParams().set('subcategoryId', subcategoryId)
    return this.http.delete<ResponseApi>(`${ this.urlEndpoint }/${subcategoryId}`)
  }
}
