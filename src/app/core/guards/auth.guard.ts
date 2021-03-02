import {
    CanActivate,
    Router,
    UrlTree
  } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';
  
  
  
  @Injectable({ providedIn: 'root' })
  export class AuthGuard implements CanActivate {
    constructor(private loginService: LoginService, private _router: Router) {}
  
      canActivate() :
          | boolean
          | UrlTree
          | Promise<boolean | UrlTree>
          | Observable<boolean | UrlTree> {
              
          if (this.loginService.getToken()) {
              return true;
          }
          return this._router.createUrlTree(['/auth']);
      }
  }
  