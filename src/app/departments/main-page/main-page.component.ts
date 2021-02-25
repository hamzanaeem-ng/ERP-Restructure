import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/core/services/app-state.service';
import { LoginService } from 'src/app/core/services/login.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less']
})
export class MainPageComponent implements OnInit, OnDestroy {
  department: string = 'motor';
  
  constructor( 
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private appStateService: AppStateService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.appStateService.getDropdownList();
    const deptName = this.loginService.getUserInfo()?.DepartmentName;
    this._router.navigate([deptName] , {relativeTo: this._activatedRoute} );
  }

  ngOnDestroy(): void{
  
  }

}
