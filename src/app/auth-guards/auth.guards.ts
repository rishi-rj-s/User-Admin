import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthServices } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _authService: AuthServices, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this._authService.getToken();

    if (token) {
      // Redirect based on the role
      const role = this._authService.getRole();
        this.router.navigate(role === 'admin' ? ['/admin'] : ['/home']);
        return false;
    }else{
     return true;
    }
  }
}
