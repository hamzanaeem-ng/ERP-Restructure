import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginHelpers } from 'src/app/shared/services/login.helper';
import { AppHelpers } from 'src/app/shared/utilities/app.helper';
import { AppStateService } from 'src/app/core/services/app-state.service';
import { LoginService } from 'src/app/core/services/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  isSubmitted = false;
  loginForm: FormGroup;
  Message: string;
  Error = false;
  errorMessage = '';
  StatusCode = 0;
  submitBtn = 'tkfLgBtn';
  modelsubmitBtn = 'tkfmdLGBtn';
  AppHelpers = AppHelpers;
  private httpOptions; 
  showPass:boolean = false;
  selectedDepartment = null;
  selectedBranch = null;
  departSelected = false;
  userName = null;
  loginResponse = null;
  userDept = [];
  userBranches = [];
  txtTemp = null;
  userDepartments = [];
  departmentIds = {'Motor': '', 'Health': '', 'Travel': '', 'Agriculture': '', 'Fire': '', 'Engineering': ''}

  constructor( private router: Router, 
    public _appHelpers: AppHelpers,
    public _loginHelpers: LoginHelpers,
    private appStateService: AppStateService,
    private loginService: LoginService, 
  ){
    if (this._loginHelpers.isLoggedIn() && this._loginHelpers.getUserInfo()) {
      router.navigate(['department/motor']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // this._appHelpers.showNotification('success', '', 'Hello How Are you?', 'fa fa-car');
  }

  initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      Password: new FormControl(null, Validators.required),
    })
  }

  showHidePass(){
      this.showPass = !this.showPass;
  }

  loginSubmit() {
    this.isSubmitted = true;

    if (this.loginForm.valid) {
      // let body = <LoginModel>this.loginForm.getRawValue();
      let body = <any>this.loginForm.getRawValue();
      this._appHelpers.showLoader(this.submitBtn);
      this.loginService.sendLoginRequest(body, false, false).subscribe(response => {

        this.loginResponse = response;

        this.userDept = response.userDepartments;
        this.userBranches = response.userBranches;

        // Default Selecting the first Department & Branch
        // this.selectedDepartment = this.userDept[0].FkDepartmentId;
        
        this.userDept.forEach(dept=>{
          this.userDepartments.push(dept.DepartmentName)
          this.departmentIds[dept.DepartmentName] = dept.FkDepartmentId
          if(dept.FkDepartmentId == this.userDept['FkDepartmentId']){
            this.selectedDepartment = dept.DepartmentName
          }
        })

        if (this.userBranches.length > 1 && this.userDept.length > 1) {
          this.txtTemp = "Select Department and Branch";
        } else if (this.userBranches.length > 1) {
          this.txtTemp = "Select Branch";
        } else {
          this.txtTemp = "Select Department";
        }

        
        if (this.userDept.length > 1 || this.userBranches.length > 1) {
          window['toggleModal']('#userDept', {backdrop: 'static', keyboard: false});
        } else {
          this.saveLoginState();
        }

        this._appHelpers.hideLoader(this.submitBtn);
      }, (error) => {
        this.loginForm.controls.Password.reset();
        this.checkLoginAttempts(error);
      });
    }
  }

  checkLoginAttempts(errorObj) {
    const username = this.loginForm.controls.username.value;
    if (errorObj?.error.message === "Incorrect password") {
      let loginArrayString = this._loginHelpers.getCookie('tkfLoginAttempts');
      loginArrayString = loginArrayString ? this._appHelpers.dcryptData(loginArrayString) : "[]";
      let loginArray = JSON.parse(loginArrayString) as any[];
      const unsuccessfulAttempts = loginArray.filter(x => x === username).length;

      if (unsuccessfulAttempts >= 2) {
        let body = {Username: username}
        loginArray.push(username)
        this.loginService.lockUser(body, false).subscribe(() => {
          this._appHelpers.showNotification('error', "", "Your account has been deactivated due to unsuccessfull login attempts. Please contact your Administrator.", '');
          this._loginHelpers.deleteCookie('tkfLoginAttempts');
        });
      } else {
        loginArray.push(username);
        
      }
      
      this._loginHelpers.setCookie('tkfLoginAttempts', this._appHelpers.encryptData(JSON.stringify(loginArray)));
    }
    this._appHelpers.handleHttpError(errorObj);
    this._appHelpers.hideLoader();
  }

  submitDept(dept) {
    this.departSelected = true;
    if (this.selectedBranch) {
      this.selectedDepartment = dept;
      setTimeout(() => {
        this.saveLoginState();
        window['toggleModal']('#userDept', 'hide');
      }, 1000);
    }
  }

  csDropdownChangeListener(scope, event) {
    switch (scope) {
      case 'department': {
        this.selectedDepartment = event.FkDepartmentId;
      }
        break;
      case 'branch': {
        this.selectedBranch = event; // whole object
      }
        break;
    }
  }

  saveLoginState() {

    this._loginHelpers.saveToken(this.loginResponse.authorizedToken);
    delete this.loginResponse['authorizedToken'];
    let logonnResponse = this.loginResponse;
    logonnResponse['FkDepartmentId'] = this.selectedDepartment;
    logonnResponse['FkBranchId'] = this.selectedBranch.FkBranchId;
    logonnResponse['BranchCode'] = this.selectedBranch.BranchCode;
    logonnResponse['ProvinceId'] = this.selectedBranch.FkProvinceId;
    this._loginHelpers.saveUserInfo(logonnResponse);
    this.appStateService.departChange.next(this.selectedDepartment);
    // this._appHelpers.showNotification("success", "", "Successfully Logged In!");
    this.appStateService.getDropdownList();
    window['fadeLoaderIn']();
    if (this.appStateService.permissions) {
      this._appHelpers.showNotification("success", "", "Successfully Logged In!");
    }
    this.router.navigate(['general/master']);

  }
}


