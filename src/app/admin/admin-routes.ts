import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/shared_service/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';





const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        loadComponent: () => import('./dashboard-data/dashboard-data.component').then(m => m.DashboardDataComponent),
      },
     
      {
        path: 'masters/categories',
        canActivate: [AuthGuard],
        loadComponent: () => import('./masters/add-category/add-category').then(m => m.AddCategory),
      },
       {
        path: 'masters/sub-categories',
        canActivate: [AuthGuard],
        loadComponent: () => import('./masters/add-subcategory/add-subcategory').then(m => m.AddSubcategory),
      },
      {
        path: 'masters/authors',
        canActivate: [AuthGuard],
        loadComponent: () => import('./masters/authors-update/authors-update').then(m => m.AuthorsUpdate),
      },
       {
        path: 'masters/add-authors',
        canActivate: [AuthGuard],
        loadComponent: () => import('./masters/addauthors/addauthors').then(m => m.AddAuthors),
      },
       {
        path: 'masters/publisher',
        canActivate: [AuthGuard],
        loadComponent: () => import('./masters/publisher-update/publisher-update').then(m => m.PublisherUpdate),
      },
        {
        path: 'masters/authors/edit/:id',
        canActivate: [AuthGuard],
        loadComponent: () => import('./masters/addauthors/addauthors').then(m => m.AddAuthors),
      },
         {
        path: 'masters/add-books',
        canActivate: [AuthGuard],
        loadComponent: () => import('./masters/add-books/add-books').then(m => m.AddBooks),
      },
      {
        path: 'masters/books',
        canActivate: [AuthGuard],
        loadComponent: () => import('./masters/books-update/books-update').then(m => m.BooksUpdate),
      },
      {
        path: 'masters/books/edit/:id',
        canActivate: [AuthGuard],
        loadComponent: () => import('./masters/add-books/add-books').then(m => m.AddBooks),
      },
       {
        path: 'orders/allOrders',
        canActivate: [AuthGuard],
        loadComponent: () => import('./orders/orders').then(m => m.Orders),
      },
      {
        path: 'orders/pending-Orders',
        canActivate: [AuthGuard],
        loadComponent: () => import('./orderManagement/pending-orders/pending-orders').then(m => m.PendingOrders),
      },
      {
        path: 'orders/myOrders',
        canActivate: [AuthGuard],
        loadComponent: () => import('./orderManagement/myorders/myorders').then(m => m.Myorders),
      },
      {
        path: 'orders/shipped-Orders',
        canActivate: [AuthGuard],
        loadComponent: () => import('./orderManagement/shipped-orders/shipped-orders').then(m => m.ShippedOrders),
      },
      {
        path: 'orders/delivered-Orders',
        canActivate: [AuthGuard],
        loadComponent: () => import('./orderManagement/delivered-orders/delivered-orders').then(m => m.DeliveredOrders),
      },
      {
        path: 'orders/cancelled-Orders',
        canActivate: [AuthGuard],
        loadComponent: () => import('./orderManagement/cancelled-orders/cancelled-orders').then(m => m.CancelledOrders),
      },
      {
        path: 'orders/:id',
        canActivate: [AuthGuard],
        loadComponent: () => import('./orderManagement/order-details/order-details').then(m => m.OrderDetails),  // Lazy load the component
      },
    

   
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
