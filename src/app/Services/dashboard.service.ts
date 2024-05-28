import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private urlEndpoint: string = environment.endpoint.concat("dashboard");

  constructor(private http: HttpClient) { }

  GetDashboard (): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${ this.urlEndpoint }/summary`)
  }
}
