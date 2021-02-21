import { Injectable } from '@angular/core';
import { AppConfig } from './app.config';
import * as CryptoJS from 'crypto-js';
import { EMPTY } from 'rxjs';


@Injectable({
    providedIn:'root'
})
export class AppHelpers{
  
  constructor(private _appConfig: AppConfig) { }

  generateRandomNumber(length = 20) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  showLoader(elementId) {
      document.getElementById(elementId).classList.add('is--loading');
  }

  hideLoader(elementId = null) {
      if (elementId) {
        document.getElementById(elementId) ? document.getElementById(elementId).classList.remove('is--loading') : null;
      } else {
        document.querySelectorAll('.is--loading').forEach(element => {
          element.classList.remove('is--loading');
        });
      }
  }

  encryptData(data): string {
    return CryptoJS.AES.encrypt(data, this._appConfig.privateCryptoKey).toString();
  }

  dcryptData(data): string{
      const bytes = CryptoJS.AES.decrypt(data, this._appConfig.privateCryptoKey);
      return bytes.toString(CryptoJS.enc.Utf8);
  }

  handleHttpError(errorObj) {
    
    let ErrorObj = {};
    let ErrorList = [];
    let Message;
    let Status;
    let Icon;
    let ExtraClass = "";
    
    if (errorObj.status === 200) { // Success With Message
      Message = errorObj.error && errorObj.error.text ? errorObj.error.text : "Action has been successfully performed!";
      Status = "success";
      Icon = "fa fa-check-circle";  
    } else if(errorObj.status === 400) { // Error
      ErrorObj = errorObj?.error?.errors || [];
      Message = '<ul class="tkf-error-list">'
      Status = "error";
      Icon = "fa fa-warning";
      ExtraClass = "notify-errorlist"
      
      ErrorList = Object.keys(ErrorObj);
      ErrorList.forEach((e, i) => {
        Message += `<li>${ErrorObj[e][0]}</li>`
      })
      Message += '</ul>'

    } else { // Error
      Message = errorObj.error && errorObj.error.message ? errorObj.error.message : "Something went wrong!";
      Status = "error";
      Icon = "fa fa-warning";  
    }

    if (errorObj.statusText === "Unauthorized") {
      if (!document.querySelector('#nonAuthorizedModal.is--opening')) {
        document.querySelector('#nonAuthorizedModal').classList.add('is--opening');
        document.getElementById('nonAuthorizedModalToggler').click();
        document.getElementById('nonAuthorizedModal').style.display = 'block';
      }
      setTimeout(() => {
        document.querySelector('#nonAuthorizedModal').classList.remove('is--opening');
      }, 1000);
    }

    // Show Toast
    if (errorObj.statusText !== "Unauthorized") {
      this.showNotification(Status, "", Message, Icon, ExtraClass);
    }
    this.hideLoader();
    return  EMPTY;
  }
    
  showNotification(type = 'success', title = '', message: string, icon = '', extraClass = '') {
      const config = {
        type,
        title: !(title !== '') ? false : title,
        text: message,
        icon: !(icon !== '') ? false : icon,
        extraClass: extraClass,
        // hide: false,
        delay: 6000,
        modules: {
          Buttons: {
            closerHover: false,
            stickerHover: false
          },
        }
      }
  
      switch (type) {
        case 'success':
          config.icon = "fa fa-check-circle";
          return this.createNotificationTemplate(config as any);
          break;
        case 'info':
          config.icon = "fa fa-info";
          return this.createNotificationTemplate(config as any);
          break;
        case 'notice':
          config.icon = "fa fa-warning";
          return this.createNotificationTemplate(config as any);
          break;
        case 'error':
          config.icon = "fa fa-close";
          return this.createNotificationTemplate(config as any);
          break;
      }
  }

  createNotificationTemplate(config) {
      const notify = document.querySelector('.notification-placer');
      const randomId = `tkfn-${this.generateRandomNumber(10)}`;
      const template = `
        <div id="${randomId}" class="tkf-notify theme--${config.type} ${config.extraClass}">
            <div class="tkf-notify-wrapper">
                <div class="tkf-content">
                    <span class="tkf-symbol ${config.icon}"></span>
                    <span class="tkf-text">${config.text}</span>
                    <span class="tkf-action js-tkfn-close">
                      <i class="icons icon-close"></i>
                    </span>
                </div>
            </div>
        </div>
      `;
      notify.insertAdjacentHTML('afterbegin', template);
      const newElem = document.querySelector(`#${randomId}`);
  
      const closer = document.querySelector(`#${randomId} .js-tkfn-close`).addEventListener('click', (event) => {
        this.removeNotificationTemplate(randomId);
      })
  
      setTimeout(() => {
        newElem.classList.add('tkfn-show');
      }, 100);
  
      setTimeout(() => {
         this.removeNotificationTemplate(randomId)
      }, config.delay);
  }

  removeNotificationTemplate(parentId) {
      const newElem = document.querySelector(`#${parentId}`)
      newElem ? newElem.classList.add('tkfn-hide') : null;
      setTimeout(() => {
        newElem?.remove();
      }, 800);
  }
}

