import { Injectable } from "@angular/core";
import * as CryptoJS from 'crypto-js';
import { BehaviorSubject, Subject } from 'rxjs';
import { AppConfig } from 'src/app/shared/utilities/app.config';
import { AppHelpers } from 'src/app/shared/utilities/app.helper';
import { LoginAPI } from './login.api';


@Injectable({
    providedIn: 'root'
})
export class LoginService{
    private currentEnvironment = location.pathname.includes('Prod') || location.pathname.includes('Test') || location.pathname.includes('Staging') ? location.pathname.split('/')[1] : '';
    private _loginToken = null;
    user = new BehaviorSubject<any>(null);

    private readonly _departChange =  new Subject<string>();
    set departChange(val: any){
       this._departChange.next(val);
    }
    
    constructor(private _appConfig: AppConfig, private loginAPI: LoginAPI) { }
  
    isLoggedIn() {
        return this._loginToken ? true : false;
    }

    getToken(): string {
        if (this._loginToken) {
          return this._loginToken;
        }
        return this.getCookie('tkfToken'+ this.currentEnvironment);
    }
  
    saveToken(token: string) {
      this._loginToken = token;
      this.setCookie('tkfToken' + this.currentEnvironment, token);
    }

    destroyToken() {
      this._loginToken = null;
      this.deleteCookie('tkfToken' + this.currentEnvironment);
    }

    getUserInfo() {
      const userInfo = this.getCookie('tkfUserInfo' + this.currentEnvironment) ? JSON.parse(this.getCookie('tkfUserInfo' + this.currentEnvironment)) : null;    
      this.user.next(userInfo);
      return this.user.getValue();
    }

    saveUserInfo(userInfo) {
      this.user.next(userInfo);
      this.setCookie('tkfUserInfo' + this.currentEnvironment, JSON.stringify(userInfo));
    }
  
    destroyUserInfo() {
      this.user.next(null);
      this.deleteCookie('tkfUserInfo' + this.currentEnvironment);
    }
  
   /** set cookie details
   * @param {String} cname Cooke name
   * @param {String} cvalue Cooke value
   * @param {Number} exdays Expiry Days Count
   */
    setCookie(cname, cvalue, exdays = 10) {
      localStorage.setItem(cname, cvalue);
    }
  
    /** get cookie details by name
     * @param {String} cname Cooke name
     * @returns {String} as cookie details
     */
    getCookie(cname) {
      const storage = localStorage.getItem(cname) ? localStorage.getItem(cname) : null;
      return storage
    }
    /** delete cookie by name
     * @param {String} cname Cooke name
    */
    deleteCookie(cname) {
      localStorage.removeItem(cname);
    }
  
    encryptData(data): string {
      return CryptoJS.AES.encrypt(data, this._appConfig.privateCryptoKey).toString();
    }
  
    dcryptData(data): string{
        const bytes = CryptoJS.AES.decrypt(data, this._appConfig.privateCryptoKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    generateURLHash(value: string | {[key: string]: string}): string{
      const randomKey = AppHelpers.generateRandomNumber(5);
      let urlObj = this.getCookie('tfkUrlhash');
      urlObj = urlObj ? this.dcryptData(urlObj) : "{}";
      urlObj = JSON.parse(urlObj) || {};
      urlObj[randomKey] = value;
  
      this.setCookie('tfkUrlhash', this.encryptData(JSON.stringify(urlObj)));
  
      return randomKey;
    }

    checkLoginAttempts(errorObj, username) {
      
      if (errorObj?.error.message === "Incorrect password") {
        let loginArrayString = this.getCookie('tkfLoginAttempts');
        loginArrayString = loginArrayString ? this.dcryptData(loginArrayString) : "[]";
        let loginArray = JSON.parse(loginArrayString) as any[];
        const unsuccessfulAttempts = loginArray.filter(x => x === username).length;
  
        if (unsuccessfulAttempts >= 2) {
          let body = {Username: username}
          loginArray.push(username)
          this.loginAPI.lockUser(body, false).subscribe(() => {
            AppHelpers.showNotification('error', "", "Your account has been deactivated due to unsuccessfull login attempts. Please contact your Administrator.", '');
            this.deleteCookie('tkfLoginAttempts');
          });
        } else {
          loginArray.push(username);
          
        }
        
        this.setCookie('tkfLoginAttempts', this.encryptData(JSON.stringify(loginArray)));
      }

      AppHelpers.handleHttpError(errorObj);
      AppHelpers.hideLoader();
    }
}