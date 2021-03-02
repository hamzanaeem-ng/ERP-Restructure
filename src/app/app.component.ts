
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { threadId } from 'worker_threads';
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
    this.loginService.extractToken();

    window.addEventListener('storage',() =>{
      this.loginService.destroyToken();
      this._router.navigate(['auth']);
    });
 
  }

}
