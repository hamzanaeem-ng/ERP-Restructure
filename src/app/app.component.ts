import { Component, OnInit } from '@angular/core';
import { LoginService } from './core/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  title = 'takaful-ERP-Restructure';

  constructor(private loginService: LoginService) {}

  ngOnInit(){
    // this.loginService.autoLogin
  }

}
