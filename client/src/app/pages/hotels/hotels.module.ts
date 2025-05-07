import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HotelsComponent } from './hotels.component';

const routes: Routes = [
  {
    path: '',
    component: HotelsComponent
  }
];

@NgModule({
  declarations: [
    HotelsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class HotelsModule { }
