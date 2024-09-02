import { Component, OnInit } from '@angular/core';
import { AuthServices } from '../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loginSuccess, logout } from '../states/profile/profile.actions';
import { Observable } from 'rxjs';
import { selectProfileEmail, selectProfileName } from '../states/profile/profile.selector';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{
  name$: Observable<string | null>;
  email$: Observable<string | null>;
  
  constructor(private authService: AuthServices, private router: Router, private store: Store) {
    this.name$ = this.store.select(selectProfileName);
    this.email$ = this.store.select(selectProfileEmail);
  }

  logout(): void {
    this.store.dispatch(logout());
    this.authService.logout();
  }

  ngOnInit(): void {
    const userDetails = this.authService.getUserDetails();
    this.store.dispatch(loginSuccess({ user: userDetails }));
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
