
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class LoginAPI {
  apiResponse = null;
  constructor( 
    private api: ApiService
  ) {}

  sendLoginRequest(requestBody, checkLogin, handleInternalError = true) {
    return this.api.post('/Users/UserLogin', requestBody, {});
  }
  
  logout(requestBody, tokenHeader, checkLogin) {
    return this.api.post('/Users/UserLogout', requestBody, tokenHeader);
  }
  
  lockUser(requestBody, checkLogin) {
    return this.api.post('/Users/LockUser', requestBody, {});
  }

  sendForgetPasswordRequest(requestBody, checkLogin) {
    return this.api.post('/Users/ForgetPassword', requestBody, {});
  }

  verifyForgetToken(params, checkLogin): Promise<SentDateTime> {
    return new Promise<SentDateTime>((resolve, reject) => {
      this.api.get('/Users/GetEmailDetailsFromToken', params, {}).subscribe((response) => {
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
    return this.api.post('/Users/ResetPassword', requestBody, {});
  }

  changePassword(requestBody, tokenHeader) {
    return this.api.post('/Users/ChangePassword', requestBody, tokenHeader);
  }
}

class SentDateTime {
  SentDateTime: string;
  Valid: boolean;
}