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
  isUserListVisible = true;
  isEditMode = false;
  user: any = { name: '', email: '', password: '' };

  showUserList(): void {
    this.isUserListVisible = true;
  }

  showAddUser(): void {
    this.isUserListVisible = false;
    this.isEditMode = false;
    this.user = { name: '', email: '', password: '' }; 
  }

  handleEditUser(event: any): void {
    this.user = event;
    this.isEditMode = true;
    this.isUserListVisible = false;
  }

  handleCancel(): void {
    this.showUserList();
  }

}
