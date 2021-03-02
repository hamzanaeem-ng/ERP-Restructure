import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';



@Injectable({ providedIn: 'root' })
export class ModuleGuard implements CanActivate {
  constructor(private loginService: LoginService, private _router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {

    const userInfo = this.loginService.getUserInfo();
    const user = userInfo.userDepartments.find(dept => dept.DepartmentName == route.routeConfig.path );
    if(user){
      userInfo.FkDepartmentId = user.FkDepartmentId;
      userInfo.DepartmentName = user.DepartmentName;
      this.loginService.saveUserInfo(userInfo);
      return true;
    }
    return this._router.createUrlTree(['**']);

  }
}


