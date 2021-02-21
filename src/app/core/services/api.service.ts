import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, EMPTY} from 'rxjs';
import { Injectable } from '@angular/core';
import { AppHelpers } from 'src/app/shared/utilities/app.helper';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginHelpers } from 'src/app/shared/services/login.helper';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private _loginHelpers: LoginHelpers,
    private _appHelpers: AppHelpers
  ) { }

  formatErrors(errorObj: any) {
    this._appHelpers.handleHttpError(errorObj);
    return  EMPTY;
  }

  get(path: string, params: HttpParams = new HttpParams(), headers = {}, checkLogin = true, handleInternalError = true): Observable<any> {
    let sendRequest = false;
    // Decides to sendRequest or not
    if (checkLogin) {
      sendRequest = this._loginHelpers.isLoggedIn() ? true : false;
    } else {
      sendRequest = true;
    }

    // then sends it..
    if (sendRequest) {
      if (handleInternalError) {
        return this.http.get(`${environment.api_url}${path}`, { params, headers }).pipe(catchError(this.formatErrors));
      } else {
        return this.http.get(`${environment.api_url}${path}`, { params, headers });
      }
      
    } else {
      this.router.navigate(['auth/login']);
    }
    
  }

  put(path: string, body: Object = {}, headers = {}, checkLogin = true): Observable<any> {
    let sendRequest = false;
    // Decides to sendRequest or not
    if (checkLogin) {
      sendRequest = this._loginHelpers.isLoggedIn() ? true : false;
    } else {
      sendRequest = true;
    }

    // then sends it..
    if (sendRequest) {
      return this.http.put(`${environment.api_url}${path}`, body, { headers }).pipe(catchError(this.formatErrors));
    } else {
      this.router.navigate(['auth/login']);
    }
  }

  post(path: string, body: Object = {}, headers = {}, checkLogin = true, handleInternalError = true): Observable<any> {
    let sendRequest = false;
    // Decides to sendRequest or not
    if (checkLogin) {
      sendRequest = this._loginHelpers.isLoggedIn() ? true : false;
    } else {
      sendRequest = true;
    }

    // then sends it..
    if (sendRequest) {
      if (handleInternalError) {
        return this.http.post(`${environment.api_url}${path}`, body, { headers }).pipe(catchError(this.formatErrors));
      } else {
        return this.http.post(`${environment.api_url}${path}`, body, { headers });
      }
      
    } else {
      this.router.navigate(['auth/login']);
    }
  }

  delete(path, headers = {}, checkLogin = true): Observable<any> {
    let sendRequest = false;
    // Decides to sendRequest or not
    if (checkLogin) {
      sendRequest = this._loginHelpers.isLoggedIn() ? true : false;
    } else {
      sendRequest = true;
    }

    // then sends it..
    if (sendRequest) {
      return this.http.delete(`${environment.api_url}${path}`, { headers }).pipe(catchError(this.formatErrors));
    } else {
      this.router.navigate(['auth/login']);
    }
  }
}
