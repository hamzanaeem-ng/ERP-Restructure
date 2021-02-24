import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyRoutingModule } from './policy-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ListPageComponent],
  imports: [
    PolicyRoutingModule,
    SharedModule
  ]
})
export class PolicyModule { }
