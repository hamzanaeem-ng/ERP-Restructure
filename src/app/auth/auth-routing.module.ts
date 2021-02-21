import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Page404Component } from '../shared/layout/page404/page404.component';
import { LoginComponent } from './login/login.component';




const routes: Routes = [
  {
    // Primary Routes
    path: '' ,children: [
      { path: 'login', component: LoginComponent },
    // Secondary Routes
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', component: Page404Component },
    ]
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
