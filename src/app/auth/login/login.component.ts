import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppHelpers } from 'src/app/shared/utilities/app.helper';
import { AppStateService } from 'src/app/core/services/app-state.service';
import { LoginService } from 'src/app/core/services/login.service';
import { LoginAPI } from 'src/app/core/services/login.api';


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
    private appStateService: AppStateService,
    private loginService: LoginService,
    private loginAPI: LoginAPI 
  ){
    if (this.loginService.isLoggedIn() && this.loginService.getUserInfo()) {
      router.navigate(['department/motor']);
    }
  }

  ngOnInit(): void {
    this.initForm();
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
      AppHelpers.showLoader(this.submitBtn);
      this.loginAPI.sendLoginRequest(body, false, false).subscribe(response => {

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
          document.getElementById("userDeptBtn").click();
        } else {
          this.saveLoginState();
        }

        AppHelpers.hideLoader(this.submitBtn);
      }, (error) => {
        const username = this.loginForm.controls.username.value;
        this.loginForm.controls.Password.reset();
        this.loginService.checkLoginAttempts(error, username);
      });
    }
  }

 

  submitDept(dept) {
    this.departSelected = true;
    if (this.selectedBranch) {
      this.selectedDepartment = dept;
      setTimeout(() => {
        this.saveLoginState();
        document.getElementById("userDeptBtn").click();
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

    this.loginService.saveToken(this.loginResponse.authorizedToken);
    delete this.loginResponse['authorizedToken'];
    let logonnResponse = this.loginResponse;
    logonnResponse['FkDepartmentId'] = this.selectedDepartment;
    logonnResponse['DepartmentName'] = logonnResponse['userDepartments'].find(x => x.FkDepartmentId === this.selectedDepartment).DepartmentName;
    logonnResponse['FkBranchId'] = this.selectedBranch.FkBranchId;
    logonnResponse['BranchCode'] = this.selectedBranch.BranchCode;
    logonnResponse['ProvinceId'] = this.selectedBranch.FkProvinceId;
    this.loginService.saveUserInfo(logonnResponse);
    this.loginService.departChange = this.selectedDepartment;
    // this._appHelpers.showNotification("success", "", "Successfully Logged In!");
    // window['fadeLoaderIn']();
    
    if (this.appStateService.permissions) {
      AppHelpers.showNotification("success", "", "Successfully Logged In!");
    }
    this.router.navigate(['department']);

  }
}


