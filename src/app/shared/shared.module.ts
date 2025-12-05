import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedRoutingModule } from './shared.routes';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './shared_service/auth.guard';


@NgModule({
  declarations: [],
  imports: [
    CommonModule, SharedRoutingModule, BreadcrumbComponent, RouterModule,
  ],
  providers: [
    AuthGuard,
  ],
  exports: [BreadcrumbComponent]
})
export class SharedModule { }
