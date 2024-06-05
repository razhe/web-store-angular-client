import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { CreateSale } from '../Interfaces/create-sale';
import { GetSalesHistoryParams } from '../Interfaces/get-sales-history-params';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private urlEndpoint: string = environment.endpoint.concat("sale");

  constructor(private http: HttpClient) { }

  GetHistory (data: GetSalesHistoryParams) : Observable<ResponseApi> {
    let params = new HttpParams()
      .set("SearchTerm", data.SearchTerm);

    params = params.set("OrderNumber", data.OrderNumber!)
    params = params.set("StartDate", data.StartDate!)
    params = params.set("EndDate", data.EndDate!)

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
