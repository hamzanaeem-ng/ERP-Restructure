import { Component, OnInit } from '@angular/core';
import { AppStateService } from './core/services/app-state.service';
import { LoginService } from './core/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  title = 'takaful-ERP-Restructure';

  constructor(private loginService: LoginService, private appStateService: AppStateService) {}

  ngOnInit(){
    // to update the user behaviuor subject in loginService from the local storage
    this.loginService.getUserInfo();

  }

}
