import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { DepartmentsRoutingModule } from './departments-routing.module';
import { MainPageComponent } from './main-page/main-page.component';


@NgModule({
  declarations: [
    MainPageComponent
  ],
  imports: [
    SharedModule,
    DepartmentsRoutingModule
  ]
})
export class DepartmentsModule { }
