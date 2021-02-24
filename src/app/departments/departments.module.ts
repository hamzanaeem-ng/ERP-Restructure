import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { DepartmentsRoutingModule } from './departments-routing.module';
import { MainPageComponent } from './main-page/main-page.component';


@NgModule({
  declarations: [
    MainPageComponent
  ],
  imports: [
    DepartmentsRoutingModule,
    SharedModule
  ]
})
export class DepartmentsModule { }
