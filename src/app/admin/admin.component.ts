import { Component } from '@angular/core';
import { AuthServices } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  constructor(private authService: AuthServices){}
  logout(): void {
    this.authService.logout();
  }

  isUserListVisible: boolean = true;

  // Function to show the add-user component
  showAddUser() {
    this.isUserListVisible = false;
  }

  // Function to show the user-list component
  showUserList() {
    this.isUserListVisible = true;
  }

}
