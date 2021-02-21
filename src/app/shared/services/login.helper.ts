import { Injectable } from "@angular/core";
import { AppConfig } from '../utilities/app.config';

@Injectable({
    providedIn: 'root'
})
export class LoginHelpers{
    private currentEnvironment = location.pathname.includes('Prod') || location.pathname.includes('Test') || location.pathname.includes('Staging') ? location.pathname.split('/')[1] : '';
  
    constructor(private _appConfig: AppConfig) { }
  
    isLoggedIn() {
        return this.getToken() ? true : false;
    }
    getToken(): string {
        if (this._appConfig.loginToken) {
          return this._appConfig.loginToken;
        }
        return this.getCookie('tkfToken'+ this.currentEnvironment);
    }
  
    saveToken(token: string) {
      this._appConfig.loginToken = token;
      this._appConfig.isLoggedIn = true;
      this.setCookie('tkfToken' + this.currentEnvironment, token);
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
  
    getUserInfo() {
        return this.getCookie('tkfUserInfo' + this.currentEnvironment) ? JSON.parse(this.getCookie('tkfUserInfo' + this.currentEnvironment)) : null;    
    }
  
    saveUserInfo(userInfo) {
      this.setCookie('tkfUserInfo' + this.currentEnvironment, JSON.stringify(userInfo));
    }
  
    saveUserInfoDepartment(userInfo) {
      this.setCookie('tkfUserInfoDepartment', JSON.stringify(userInfo));
    }
}