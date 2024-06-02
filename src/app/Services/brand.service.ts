import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private urlEndpoint: string = environment.endpoint.concat("brand");

  constructor(private http: HttpClient) { }

  list(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${ this.urlEndpoint }`)
  }
}
