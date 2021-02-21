import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyRoutingModule } from './policy-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';


@NgModule({
  declarations: [ListPageComponent],
  imports: [
    PolicyRoutingModule
  ]
})
export class PolicyModule { }
