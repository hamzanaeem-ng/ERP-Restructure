
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiResponse = null;
  constructor( 
    private api: ApiService
  ) {}

  sendLoginRequest(requestBody, checkLogin, handleInternalError = true) {
    return this.api.post('/Users/UserLogin', requestBody, {}, checkLogin, handleInternalError);
  }
  
  logout(requestBody, tokenHeader, checkLogin) {
    return this.api.post('/Users/UserLogout', requestBody, tokenHeader, checkLogin);
  }
  
  lockUser(requestBody, checkLogin) {
    return this.api.post('/Users/LockUser', requestBody, {}, checkLogin);
  }

  sendForgetPasswordRequest(requestBody, checkLogin) {
    return this.api.post('/Users/ForgetPassword', requestBody, {}, checkLogin);
  }

  verifyForgetToken(params, checkLogin): Promise<SentDateTime> {
    return new Promise<SentDateTime>((resolve, reject) => {
      this.api.get('/Users/GetEmailDetailsFromToken', params, {}, checkLogin).subscribe((response) => {
        response.Valid = true;
        this.apiResponse = response;
        resolve(response);
      }, error => {
      }, () => {
        if (!this.apiResponse) {
          let response: SentDateTime = {Valid: false, SentDateTime: null};
          this.apiResponse = response;
          resolve(response);
        }
      });
    });  
  }

  resetPassword(requestBody, checkLogin) {
    return this.api.post('/Users/ResetPassword', requestBody, {}, checkLogin);
  }

  changePassword(requestBody, tokenHeader) {
    return this.api.post('/Users/ChangePassword', requestBody, tokenHeader, true, false);
  }
}

class SentDateTime {
  SentDateTime: string;
  Valid: boolean;
}