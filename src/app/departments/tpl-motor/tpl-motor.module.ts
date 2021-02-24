import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TplMotorRoutingModule } from './tpl-motor-routing.module';
import { GeneralSetupComponent } from './home/general-setup/general-setup.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    GeneralSetupComponent
  ],
  imports: [
    TplMotorRoutingModule,
    SharedModule

  ]
})
export class TplMotorModule { }
