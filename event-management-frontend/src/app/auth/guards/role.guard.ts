import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/auth/login']);
    }
    
    // Get allowed roles from route data
    const allowedRoles = route.data['roles'] as Array<string>;
    
    // Check if user has required role
    if (allowedRoles && this.authService.checkRole(allowedRoles)) {
      return true;
    }
    
    // Redirect to unauthorized page if user doesn't have required role
    return this.router.createUrlTree(['/events']);
  }
}