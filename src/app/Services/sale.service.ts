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

  GetHistory (searchTerm: string, orderNumber?: string, startDate?: string, endDate?: string): Observable<ResponseApi> {
    const params = new HttpParams()
      .set("SearchTerm", searchTerm)

    if (orderNumber)
      params.set("OrderNumber", orderNumber)
    if (startDate)
      params.set("StartDate", startDate)
    if (endDate)
      params.set("EndDate", endDate)

    return this.http.get<ResponseApi>(`${ this.urlEndpoint }/history`, { params })
  }

  GetReport (startDate: string, endDate: string): Observable<ResponseApi> {
    const params = new HttpParams()
      .set("StartDate", startDate)
      .set("EndDate", endDate)

    return this.http.get<ResponseApi>(`${ this.urlEndpoint }/report`, { params })
  }

  Create (request: CreateSale[]) : Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${ this.urlEndpoint }`, request)
  }
}
