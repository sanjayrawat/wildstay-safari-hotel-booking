import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'hotels',
    loadChildren: () => import('./pages/hotels/hotels.module').then(m => m.HotelsModule)
  },
  {
    path: 'safaris',
    loadChildren: () => import('./pages/safaris/safaris.module').then(m => m.SafarisModule)
  },
  {
    path: 'booking',
    loadChildren: () => import('./pages/booking/booking.module').then(m => m.BookingModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
