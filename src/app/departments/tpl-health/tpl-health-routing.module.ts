import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralSetupComponent } from './home/general-setup/general-setup.component';

const routes: Routes = [
  {
    path: '',  children: [
      // primary routes
      { path: 'general/master', component: GeneralSetupComponent },
      { 
        path: 'policy', loadChildren: () => import(`./policy/policy.module`).then(m => m.PolicyModule) 
      },
      // secondary routes
      { path: '', redirectTo: 'general/master', pathMatch: 'full' },
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TplHealthRoutingModule { }
