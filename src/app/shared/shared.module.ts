import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './layout/header/header.component';
import { IconDrawerComponent } from './layout/icon-drawer/icon-drawer.component';
import { Page404Component } from './layout/page404/page404.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent, 
    IconDrawerComponent,  
    Page404Component
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent, 
    IconDrawerComponent,  
    Page404Component
  ]
})
export class SharedModule { }
