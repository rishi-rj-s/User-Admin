import { Component } from '@angular/core';
import { AuthServices } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { loginSuccess } from '../states/profile/profile.actions';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private _authService : AuthServices, private router : Router, private toastr: ToastrService, private store: Store){}

  onSubmit() {
    console.log(this.email, this.password);
    this._authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        
        this._authService.storeToken(response.token, response.role);
        this._authService.storeProfilePic(response.details.pic);
        this._authService.storeUserDetails(response.details);
        
        this.store.dispatch(loginSuccess({
          user: {
            id: response.details.id,
            email: response.details.email,
            name: response.details.name,
          }
        }));

        this.toastr.success('Login successful!', 'Success');
        if(response.role==='admin') return this.router.navigate(['\admin']);
        else return this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.toastr.error(err.error.message, 'Login Failed');
      }
    });
  }
}
