import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TplHealthRoutingModule } from './tpl-health-routing.module';
import { GeneralSetupComponent } from './home/general-setup/general-setup.component';

@NgModule({
  declarations: [
    GeneralSetupComponent
  ],
  imports: [
    TplHealthRoutingModule
  ]
})
export class TplHealthModule { }
