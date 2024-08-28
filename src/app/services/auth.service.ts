import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../environment/environment";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { Observable } from "rxjs";


@Injectable({
     providedIn: 'root'
})

export class AuthServices {
     private loginUrl = environment.BASE_URL;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.loginUrl}/login`, { email, password });
  }

  storeToken(token: string, role: string, userDetails?:object): void {
    console.log("Role is",role);
     if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
       localStorage.setItem('authToken', token);
       localStorage.setItem('role', role);
       localStorage.setItem('userDetails', JSON.stringify(userDetails || {}));
     }
   }
 
   getToken(): string | null {
     if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
       return localStorage.getItem('authToken');
     }
     return null;
   }
 
   getRole(): string | null {
     if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
       return localStorage.getItem('role');
     }
     return null;
   }

   getUserDetails(): any | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const details = localStorage.getItem('userDetails');
      return details ? JSON.parse(details) : null; // Return null if no details are found
    }
    return null;
  }
 
   clearToken(): void {
     if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
       localStorage.removeItem('authToken');
       localStorage.removeItem('role');
     }
   }

   uploadProfilePicture(file: File, id?: string): Observable<any> {
    const formData = new FormData();
    formData.append('profilePic', file);
    if (id) {
      formData.append('id', id);
    }

    return this.http.post<any>(`${this.loginUrl}/profile-pic`, formData);
  }
  logout(): void {
    this.clearToken();
    this.toastr.success('Logout succesful!', 'Success');
    this.router.navigate(['']);
  }
}