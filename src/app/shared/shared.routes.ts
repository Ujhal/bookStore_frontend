import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./carousel/carousel.component').then(m => m.CarouselComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'view-book/:id',
        loadComponent: () => import('./view-book/view-book').then(m => m.ViewBook)
      },
      {
        path: 'about', 
        loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'about-us', 
        loadComponent: () => import('./about-us/about-us').then(m => m.AboutUsComponent )
      },
       {
        path: 'contact-us', 
        loadComponent: () => import('./contactus-component/contactus-component').then(m => m.ContactusComponent)
      },
      {
        path: 'termsofUse', 
        loadComponent: () => import('./terms/terms').then(m => m.Terms)
      },
      {
        path: 'privacy-policy', 
        loadComponent: () => import('./privacypolicycomponent/privacypolicycomponent').then(m => m.Privacypolicycomponent)
      },
      {
        path: 'faqs', 
        loadComponent: () => import('./faqs/faqs').then(m => m.Faqs)
      },
      {
        path: 'returnsandcancellation', 
        loadComponent: () => import('./returns/returns').then(m => m.Returns)
      },
      {
        path: 'payments', 
        loadComponent: () => import('./payments/payments').then(m => m.Payments)
      },
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
