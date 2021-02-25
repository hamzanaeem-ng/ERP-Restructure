import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppHelpers } from 'src/app/shared/utilities/app.helper';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class LoginAPI {

  apiResponse = null;
  
  constructor( 
    private api: ApiService
    ) {}
    
  sendLoginRequest(requestBody) {
   return this.api.post('/Users/UserLogin', requestBody, AppHelpers.addHeaders(true))
  }
  
  logout(requestBody) {
    return this.api.post('/Users/UserLogout', requestBody);
  }
  
  lockUser(requestBody) {
    return this.api.post('/Users/LockUser', requestBody, {});
  }

  sendForgetPasswordRequest(requestBody) {
    return this.api.post('/Users/ForgetPassword', requestBody, {});
  }

  verifyForgetToken(params): Promise<SentDateTime> {
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

  resetPassword(requestBody,) {
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