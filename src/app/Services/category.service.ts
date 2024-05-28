import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { CreateUpdateCategory } from '../Interfaces/create-update-category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private urlEndpoint: string = environment.endpoint.concat("category");

  constructor(private http: HttpClient) { }

  list (): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${ this.urlEndpoint }`)
  }

  Create (request: CreateUpdateCategory) : Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${ this.urlEndpoint }`, request)
  }

  Update (request: CreateUpdateCategory, categoryId: string) : Observable<ResponseApi> {
    const params = new HttpParams().set('categoryId', categoryId)
    return this.http.put<ResponseApi>(`${ this.urlEndpoint }`, request, { params })
  }

  Remove (categoryId: string) : Observable<ResponseApi> {
    const params = new HttpParams().set('categoryId', categoryId)
    return this.http.delete<ResponseApi>(`${ this.urlEndpoint }`, { params })
  }
}
