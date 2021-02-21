import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Page404Component } from '../shared/layout/page404/page404.component';
import { MainPageComponent } from './main-page/main-page.component';

const routes: Routes = [
  // Primary Routes
  {
    path: '', component: MainPageComponent ,children: [
      // primary routes
      { path: 'health', loadChildren: () => import(`./tpl-health/tpl-health.module`).then(m => m.TplHealthModule) },
      { path: 'motor', loadChildren: () => import(`./tpl-motor/tpl-motor.module`).then(m => m.TplMotorModule) },
      // secondary routes
     
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentsRoutingModule { }
