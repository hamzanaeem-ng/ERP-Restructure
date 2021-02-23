
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
      private api: ApiService,
  ) { }

  getUsers(requestBody = {}, tokenHeader) {
    return this.api.post('/Users/GetUsers', requestBody, tokenHeader);
  }

  addUser(requestBody, tokenHeader) {
    return this.api.post('/Users/AddUser', requestBody, tokenHeader);
  }
  getUserRolePermisions(params) {
    return this.api.get('/Users/GetPrivilegeByRole', params)
  }

  updateUser(requestBody, tokenHeader) {
    return this.api.post('/Users/UpdateUser', requestBody, tokenHeader);
  }

  getRoles(requestBody, tokenHeader) {
    return this.api.post('/Users/GetRole', requestBody, tokenHeader);
  }

  addRole(requestBody, tokenHeader) {
    return this.api.post('/Users/AddRole', requestBody, tokenHeader);
  }

  updateRole(requestBody, tokenHeader) {
    return this.api.post('/Users/UpdateRole', requestBody, tokenHeader);
  }

  addModule(requestBody, tokenHeader) {
    return this.api.post('/Users/AddModule', requestBody, tokenHeader);
  }

  updateModule(requestBody, tokenHeader) {
    return this.api.post('/Users/UpdateModule', requestBody, tokenHeader);
  }

  addForm(requestBody, tokenHeader) {
    return this.api.post('/Users/AddAction', requestBody, tokenHeader);
  }

  updateForm(requestBody, tokenHeader) {
    return this.api.post('/Users/UpdateAction', requestBody, tokenHeader);
  }

  addPrivileges(requestBody, tokenHeader) {
    return this.api.post('/Users/AddPrivileges', requestBody, tokenHeader);
  }

  clonePrivilege(requestBody, tokenHeader) {
    return this.api.get('/Users/ClonePrivileges', requestBody, tokenHeader);
  }

  getPrivileges(requestBody, tokenHeader) {
    return this.api.get('/Users/GetAllPrivileges', requestBody, tokenHeader);
  }
}
