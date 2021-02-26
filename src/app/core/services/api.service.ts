import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(
    private http: HttpClient,
  ) { }

  get(path: string, params: HttpParams = new HttpParams(), skipErrorHandling = false, skipLoginCheck = false): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`, { params, ...this.addHeaders(skipErrorHandling, skipLoginCheck)});   
  }

  put(path: string, body: Object = {}, skipErrorHandling = false, skipLoginCheck = false): Observable<any> {
    return this.http.put(`${environment.api_url}${path}`, body, this.addHeaders(skipErrorHandling, skipLoginCheck));
  }

  post(path: string, body: Object = {}, skipErrorHandling = false, skipLoginCheck = false): Observable<any> {
    return this.http.post(`${environment.api_url}${path}`, body, this.addHeaders(skipErrorHandling, skipLoginCheck) );
  }

  delete(path, skipErrorHandling = false, skipLoginCheck = false): Observable<any> {
    return this.http.delete(`${environment.api_url}${path}`, this.addHeaders(skipErrorHandling, skipLoginCheck));
  }

  addHeaders(skipErrorHandling, skipLoginCheck){
    let headers = new HttpHeaders();
    if(skipLoginCheck){
      headers = headers.append('X-Skip-Login-Check', 'Skip Error Handling');
    }
    if(skipErrorHandling){
      headers = headers.append('X-Skip-Error-Handling', 'Skip Error Handling');
    }
    return {headers};
  }

}
