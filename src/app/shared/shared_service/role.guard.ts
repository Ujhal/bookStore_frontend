// role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  // role.guard.ts
canActivate(route: ActivatedRouteSnapshot): boolean {
  const expectedRoles: number[] = route.data['roles'];
  const userRole = this.auth.getUserRole();

  if (!userRole || !expectedRoles.includes(userRole)) {
    this.router.navigate(['/unauthorized']);
    return false;
  }
  return true;
}




}
