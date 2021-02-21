import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less']
})
export class MainPageComponent implements OnInit {
  department: string = 'motor';

  constructor( private _router: Router, private _activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
     if(this.department === 'motor'){
      this._router.navigate(['motor'],{relativeTo: this._activatedRoute});
    }
    else if(this.department === 'health'){
      this._router.navigate(['health'],{relativeTo: this._activatedRoute});
    }
  }

}
