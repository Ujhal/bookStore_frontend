import { CommonModule } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, Subscribable, Subscription, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent {
  breadcrumbs = new BehaviorSubject<any[]>([]);
  breadcrumbs$: Observable<undefined> | Subscribable<undefined> | Promise<undefined> | undefined;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const root: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
      const breadcrumbs = this.createBreadcrumbs(root);
      this.breadcrumbs.next(breadcrumbs);
    });
  }

  private createBreadcrumbs(route: ActivatedRouteSnapshot, url: string = '', breadcrumbs: any[] = []): any[] {
    const children: ActivatedRouteSnapshot[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      breadcrumbs.push({
        label: child.data['breadcrumb'],
        url: url
      });

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }


}


