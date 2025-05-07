import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SafarisComponent } from './safaris.component';

const routes: Routes = [
  {
    path: '',
    component: SafarisComponent
  }
];

@NgModule({
  declarations: [
    SafarisComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class SafarisModule { }
