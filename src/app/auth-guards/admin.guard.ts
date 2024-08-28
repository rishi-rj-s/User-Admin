import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthServices } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {

  constructor(private _authService: AuthServices, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this._authService.getToken();
    const role = this._authService.getRole();

    if (token && role === 'admin') {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
