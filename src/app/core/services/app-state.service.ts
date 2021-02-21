import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

import { AppHelpers } from '../../shared/utilities/app.helper';
import { AppConfig } from '../../shared/utilities/app.config';
import { LoginHelpers } from '../../shared/services/login.helper';
import { UserService } from './user.service';

@Injectable({
    providedIn:'root'
})
export class AppStateService{
    
    private httpOptions = this._loginHelpers.getToken() ? new HttpHeaders().set("Authorization", "Bearer " + this._loginHelpers.getToken().toString()) : null;
    private readonly _dropDowns = new BehaviorSubject<any>([]);
    readonly dropDowns$ = this._dropDowns.asObservable();
    get dropDowns(): any {
        return this._dropDowns.getValue();
    }
    set dropDowns(val: any) {
        this._dropDowns.next(val);
    }

    private readonly _permissions = new BehaviorSubject<any>([]);
    readonly permissions$ = this._permissions.asObservable();
    get permissions(): any {
        return this._permissions.getValue();
    }
    set permissions(val: any) {
        this._permissions.next(val);
    }

    private readonly _departChange =  new Subject<string>();
    set departChange(val: any){
       this._departChange.next(val);
    }

    constructor(private http: HttpClient, private _loginHelpers: LoginHelpers, private _appHelpers: AppHelpers, private _appConfig: AppConfig, private user: UserService){
    }

    getPermissions(){
        const userRoleType = this._loginHelpers.getUserInfo().userRole;
        const params = { role: userRoleType }
        this.user.getUserRolePermisions(params, this.httpOptions).subscribe((response: any) => {
            this.permissions = [...response];
        })
    }

    getDropdownList(SpcTableList = null) {
        const TableList = SpcTableList || this._appConfig.DataConfig.ProductSetup;
        const headers = this.httpOptions;
        
        this.http.post(`${environment.api_url}/Users/GetAlldropDownsData`,TableList,{ headers })
        .pipe(catchError(this.formatErrors)).subscribe((response: Array<any>) => {
          
          if(!SpcTableList) this.dropDowns = [...response];
          else response.forEach((element)=>{
            const dropDown = this.dropDowns.find(dropDown => dropDown.TableName === element.TableName);
            const index = this.dropDowns.indexOf(dropDown);
            this.dropDowns[index] = {
              ...element
            }
            this.dropDowns = [...this.dropDowns];
          })
        });
    }

    formatErrors(errorObj: any) {
      this._appHelpers.handleHttpError(errorObj);
      return  EMPTY;
    }
}