import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/shared_service/auth.guard';
import { Dashboard } from './dashboard/dashboard';





const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
    {
        path: '',
        canActivate: [AuthGuard],
        loadComponent: () => import('./dashboard-data/dashboard-data').then(m => m.DashboardData),
      },
       {
        path: 'add-books',
        canActivate: [AuthGuard],
        loadComponent: () => import('./add-books/add-books').then(m => m.AddBooks),
      },
       {
        path: 'all-books',
        canActivate: [AuthGuard],
        loadComponent: () => import('./books-update/books-update').then(m => m.BooksUpdate),
      },
       {
        path: 'all-authors',
        canActivate: [AuthGuard],
        loadComponent: () => import('./authorslist/authorslist').then(m => m.Authorslist),
      },
   
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublisherRoutingModule { }
