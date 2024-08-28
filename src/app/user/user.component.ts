import { Component } from '@angular/core';
import { AuthServices } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  constructor(private authService: AuthServices, private router: Router) {}

  logout(): void {
    this.authService.logout();
  }

  navigateToProfile(): void {
    // Assuming you have a route for the profile page
    this.router.navigate(['/profile']);
  }
}
