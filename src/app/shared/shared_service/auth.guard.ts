import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: CommonService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated().pipe(
      switchMap(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/']); // redirect to login
          return of(false);
        }
        // If role check is required
        if (route.data['role']) {
          return this.authService.getRole().pipe(
            map(role => {
              if (route.data['role'].indexOf(role) === -1) {
                this.router.navigate(['/']); // redirect if role mismatch
                return false;
              }
              return true;
            }),
            catchError(err => {
              this.router.navigate(['/']);
              return of(false);
            })
          );
        }
        // No role restriction, just authenticated
        return of(true);
      }),
      catchError(err => {
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }
}
