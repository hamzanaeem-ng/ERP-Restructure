import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from 'rxjs';
import { AppConfig } from '../../shared/utilities/app.config';
import { UserService } from './user.api';
import { LoginService } from './login.service';
import { DataInitials } from '../models/app.model';

@Injectable({
    providedIn:'root'
})
export class AppStateService{
    
    private readonly _DataInitials = new BehaviorSubject<DataInitials>({} as DataInitials);
    readonly DataInitials$ = this._DataInitials.asObservable();
    get DataInitials(): DataInitials {
        return this._DataInitials.getValue();
    }
    set DataInitials(val: DataInitials) {
        this._DataInitials.next(val);
    }

    private readonly _permissions = new BehaviorSubject<any>([]);
    readonly permissions$ = this._permissions.asObservable();
    get permissions(): any {
        return this._permissions.getValue();
    }
    set permissions(val: any) {
        this._permissions.next(val);
    }

    private readonly _previousURL = new BehaviorSubject<string>(null);
    readonly previousURL$ = this._previousURL.asObservable();

    private readonly _departChange =  new Subject<string>();
    set departChange(val: any){
       this._departChange.next(val);
    }

    constructor(private http: HttpClient, private _appConfig: AppConfig, private loginService: LoginService, private user: UserService){
    }

    getPermissions(){
        const userRoleType = this.loginService.getUserInfo().userRole;
        const params = { role: userRoleType }
        this.user.getUserRolePermisions(params).subscribe((response: any) => {
            this.permissions = [...response];
        })
    }

    getDropdownList(SpcTableList = null) {
        const TableList = SpcTableList || this._appConfig.DataConfig.ProductSetup;

        this.http.post(`${environment.api_url}/Users/GetAlldropDownsData`, TableList)
            .subscribe((response: Array<any>) => {
                response.forEach((element) => {
                    this.DataInitials[element.TableName] = element.TableItems;
                })
                this.DataInitials = {...this.DataInitials };            
            });
    }

    setPreviousURL(url){
        this._previousURL.next(url);
    }

}