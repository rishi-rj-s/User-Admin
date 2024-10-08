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

  getUsers(search?: string): Observable<any> {

    let url = `${this.loginUrl}/dashboard`;
    if (search) {
      console.log(search);
      url += `?search=${search}`;
    }
    return this.http.get<any>(url);
  }

  registerUser(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.loginUrl}/register`, { name, email, password })
  }

  getUser(id: string): Observable<any> {
    return this.http.get<any>(`${this.loginUrl}/user-data/${id}`)
  }

  updateUser(user: { name: string, email: string, _id: string }): Observable<any> {
    return this.http.put<any>(`${this.loginUrl}/edit-user/${user._id}`, { user })
  }

  storeToken(token: string, role: string): void {
    console.log("Role is", role);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('authToken', token);
      localStorage.setItem('role', role);
    }
  }

  storeProfilePic(profilePic: string): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('profilePic', profilePic);
      const userDetailsJson = localStorage.getItem('userDetails');
      if (userDetailsJson) {
        const userDetails = JSON.parse(userDetailsJson);
        userDetails.pic = profilePic;
        localStorage.setItem('userDetails', JSON.stringify(userDetails));
      }
    }
  }
  storeUserDetails(userDetails: any): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('userDetails', JSON.stringify(userDetails));
    }
  }

  getProfilePic(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const profilePic = localStorage.getItem('profilePic');
      return profilePic ? profilePic : null;
    }
    return null;
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.loginUrl}/delete-user/${id}`)
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      ;
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
      localStorage.removeItem('profilePic');
      localStorage.removeItem('userDetails');
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