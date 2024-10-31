import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { TransitLine } from 'src/types/line'

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  public getAllLines(): Observable<TransitLine> {
    return this.http.get<TransitLine>(`${environment.baseURL}/transit-lines/u9`)
  }
}
