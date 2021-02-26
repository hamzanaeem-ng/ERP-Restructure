
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AppStateService } from './core/services/app-state.service';
import { LoginService } from './core/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  title = 'takaful-ERP-Restructure';
  previousURL = null;
  currentURL = null;

  constructor( 
    private loginService: LoginService,
    private appStateService: AppStateService,
    private _router: Router,
  ) {}

  ngOnInit(){
    // to update the user behaviuor subject in loginService from the local storage
    this.loginService.getUserInfo();

    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.previousURL = this.currentURL;
      console.log(this.previousURL);
      this.appStateService.setPreviousURL(this.previousURL);
      this.currentURL = event.url; 
      console.log(this.currentURL);
    });

  }

}
