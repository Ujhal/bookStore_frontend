import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/shared_service/auth.guard';
import { RoleGuard } from './shared/shared_service/role.guard';
import { Unauthorized } from './shared/unauthorized/unauthorized';




export const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule)
  },
  {
    path: 'admin', canActivate: [RoleGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    data: { roles: [1] }
  },
  {
    path: 'customer', canActivate: [RoleGuard],
    loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
     data: { roles: [2] }
  },
  {
    path: 'publisher', canActivate: [RoleGuard],
    loadChildren: () => import('./publisher/publisher.module').then(m => m.PublisherModule),
    data: { roles: [3] }
  },
  {
    path: 'unauthorized',
    component: Unauthorized
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],


})
export class AppRoutingModule { }
