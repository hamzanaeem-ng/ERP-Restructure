import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { url } from 'inspector';
import { AppStateService } from 'src/app/core/services/app-state.service';
import { LoginService } from 'src/app/core/services/login.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less']
})
export class MainPageComponent implements OnInit, OnDestroy {
  department: string = 'motor';
  appURL: string = null;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private appStateService: AppStateService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.appStateService.getDropdownList();
    
    this.appStateService.previousURL$.subscribe((url: string) => {
      this.appURL = url;
      
    })

    const deptName = this.loginService.getUserInfo()?.DepartmentName;
    
    if(this.appURL?.includes(deptName)){
      this._router.navigateByUrl(this.appURL);
    }
    else{
      this._router.navigate([deptName], { relativeTo: this._activatedRoute });
    }
  }

  ngOnDestroy(): void {

  }

}
