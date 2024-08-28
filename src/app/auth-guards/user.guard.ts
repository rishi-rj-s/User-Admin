import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthServices } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class UserGuard implements CanActivate {

  constructor(private _authService: AuthServices, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this._authService.getToken();
    const role = this._authService.getRole();

    if (token && role === 'user') {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}