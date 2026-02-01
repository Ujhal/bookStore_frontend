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
        path: 'my-books',
        canActivate: [AuthGuard],
        loadComponent: () => import('./books-update/books-update').then(m => m.BooksUpdate),
      },
      {
        path: 'all-books',
        canActivate: [AuthGuard],
        loadComponent: () => import('./all-books/all-books').then(m => m.AllBooks),
      },
       {
        path: 'all-authors',
        canActivate: [AuthGuard],
        loadComponent: () => import('./authorslist/authorslist').then(m => m.Authorslist),
      },
       {
        path: 'orders/pending-Orders',
        canActivate: [AuthGuard],
        loadComponent: () => import('./order-management/pending-orders/pending-orders').then(m => m.PendingOrders),
      },
       {
        path: 'orders/shipped-Orders',
        canActivate: [AuthGuard],
        loadComponent: () => import('./order-management/shipped-orders/shipped-orders').then(m => m.ShippedOrders),
      },
       {
        path: 'orders/delivered-Orders',
        canActivate: [AuthGuard],
        loadComponent: () => import('./order-management/delivered-orders/delivered-orders').then(m => m.DeliveredOrders),
      },
       {
        path: 'orders/all-orders',
        canActivate: [AuthGuard],
        loadComponent: () => import('./order-management/all-orders/all-orders').then(m => m.AllOrders),
      },
      {
        path: 'orders/:id',
        canActivate: [AuthGuard],
        loadComponent: () => import('./order-management/order-details/order-details').then(m => m.OrderDetails),
      },
      {
        path: 'myaccount', 
        loadComponent: () => import('../shared/my-account/my-account').then(m => m.MyAccount)
      },
      
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublisherRoutingModule { }
