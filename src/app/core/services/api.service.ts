import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, EMPTY} from 'rxjs';
import { Injectable } from '@angular/core';
import { AppHelpers } from 'src/app/shared/utilities/app.helper';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  formatErrors(errorObj: any) {
    AppHelpers.handleHttpError(errorObj);
    return  EMPTY;
  }

  // get(path: string, params: HttpParams = new HttpParams(), headers = {}, checkLogin = true, handleInternalError = true): Observable<any> {
  //   let sendRequest = false;
  //   // Decides to sendRequest or not
  //   if (checkLogin) {
  //     sendRequest = this.loginService.isLoggedIn() ? true : false;
  //   } else {
  //     sendRequest = true;
  //   }

  //   // then sends it..
  //   if (sendRequest) {
  //     if (handleInternalError) {
  //       return this.http.get(`${environment.api_url}${path}`, { params, headers }).pipe(catchError(this.formatErrors));
  //     } else {
  //       return this.http.get(`${environment.api_url}${path}`, { params, headers });
  //     }
      
  //   } else {
  //     this.router.navigate(['auth/login']);
  //   }
    
  // }

  // put(path: string, body: Object = {}, headers = {}, checkLogin = true): Observable<any> {
  //   let sendRequest = false;
  //   // Decides to sendRequest or not
  //   if (checkLogin) {
  //     sendRequest = this.loginService.isLoggedIn() ? true : false;
  //   } else {
  //     sendRequest = true;
  //   }

  //   // then sends it..
  //   if (sendRequest) {
  //     return this.http.put(`${environment.api_url}${path}`, body, { headers }).pipe(catchError(this.formatErrors));
  //   } else {
  //     this.router.navigate(['auth/login']);
  //   }
  // }

  // post(path: string, body: Object = {}, headers = {}, checkLogin = true, handleInternalError = true): Observable<any> {
  //   let sendRequest = false;
  //   // Decides to sendRequest or not
  //   if (checkLogin) {
  //     sendRequest = this.loginService.isLoggedIn() ? true : false;
  //   } else {
  //     sendRequest = true;
  //   }

  //   // then sends it..
  //   if (sendRequest) {
  //     if (handleInternalError) {
  //       return this.http.post(`${environment.api_url}${path}`, body, { headers }).pipe(catchError(this.formatErrors));
  //     } else {
  //       return this.http.post(`${environment.api_url}${path}`, body, { headers });
  //     }
      
  //   } else {
  //     this.router.navigate(['auth/login']);
  //   }
  // }

  // delete(path, headers = {}, checkLogin = true): Observable<any> {
  //   let sendRequest = false;
  //   // Decides to sendRequest or not
  //   if (checkLogin) {
  //     sendRequest = this.loginService.isLoggedIn() ? true : false;
  //   } else {
  //     sendRequest = true;
  //   }

  //   // then sends it..
  //   if (sendRequest) {
  //     return this.http.delete(`${environment.api_url}${path}`, { headers }).pipe(catchError(this.formatErrors));
  //   } else {
  //     this.router.navigate(['auth/login']);
  //   }
  // }


  get(path: string, params: HttpParams = new HttpParams(), headers = {}): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`, { params, headers }); 
  }

  put(path: string, body: Object = {}, headers = {}): Observable<any> {
    return this.http.put(`${environment.api_url}${path}`, body, { headers });
  }

  post(path: string, body: Object = {}, headers = {}): Observable<any> {
    return this.http.post(`${environment.api_url}${path}`, body, { headers });
  }

  delete(path, headers = {}): Observable<any> {
    return this.http.delete(`${environment.api_url}${path}`, { headers });
  }

}
