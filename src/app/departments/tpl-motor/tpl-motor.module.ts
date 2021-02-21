import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TplMotorRoutingModule } from './tpl-motor-routing.module';
import { GeneralSetupComponent } from './home/general-setup/general-setup.component';

@NgModule({
  declarations: [
    GeneralSetupComponent
  ],
  imports: [
    TplMotorRoutingModule
  ]
})
export class TplMotorModule { }
