import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Page404Component } from './shared/layout/page404/page404.component';



const routes: Routes = [ 
  // Primary Routes
  { 
    path: 'department', loadChildren: () => import(`./departments/departments.module`).then(m => m.DepartmentsModule) 
  },
  { 
    path: 'auth', loadChildren: () => import(`./auth/auth.module`).then(m => m.AuthModule)
  }, 
  // Secondary Routes
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
