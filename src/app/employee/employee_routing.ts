import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',   // ✅ empty because 'customer' is already in the parent module
    component: DashboardComponent,
    children: [
      {
        path: '', 
        loadComponent: () => import('./dashboard-data/dashboard-data.component')
                               .then(m => m.DashboardDataComponent)
      },
      {
        path: 'my/orders',  // /customer/my/orders
        loadComponent: () => import('./orders/orders').then(m => m.Orders)
      },
      {
        path: 'viewbook/:id',  // /customer/my/orders
        loadComponent: () => import('./viewbook/viewbook').then(m => m.Viewbook)
      },
      {
        path: 'my/account',  // /customer/my/orders
        loadComponent: () => import('../shared/my-account/my-account').then(m => m.MyAccount)
      },
      {
        path: 'my/cart',  // /customer/my/orders
        loadComponent: () => import('./cart/cart').then(m => m.Cart)
      },
      {
        path: 'my/addresses',  // /customer/my/addresses
        loadComponent: () => import('./address/address').then(m => m.Address)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
