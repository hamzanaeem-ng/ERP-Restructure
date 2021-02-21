import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { Page404Component } from 'src/app/shared/layout/page404/page404.component';



const routes: Routes = [
  {
    path: '', children: [
      // primary routes
      { path: 'list', component: ListPageComponent },
      { path: 'setup', component: ListPageComponent },
      // secondary routes
      { path: '', redirectTo: 'list', pathMatch: 'full' },
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyRoutingModule { }
