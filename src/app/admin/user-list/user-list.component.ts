import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthServices } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})

export class UserListComponent implements OnInit {
  users: any[] = [];
  searchSubject: Subject<string> = new Subject<string>();
  @Output() userEdit = new EventEmitter<any>();

  constructor(private _authServices: AuthServices, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.fetchUsers();

    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((searchTerm: string) => {
      this.fetchUsers(searchTerm);
    });
  }

  fetchUsers(search?: string): void {
    this._authServices.getUsers(search).subscribe({
      next: (response) => {
        this.users = response.users;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.toastr.error('No users found', 'Error');
      }
    });
  }

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchSubject.next(inputElement.value);
  }

  editsUser(userId: string): void {
    this._authServices.getUser(userId).subscribe({
      next: (response) => {
        this.userEdit.emit({ ...response, isEditMode: true });
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
        this.toastr.error('Failed to fetch user details', 'Error');
      }
    });
  }

  deleteUser(userId: string): void {
    this._authServices.deleteUser(userId).subscribe({
      next: (response)=>{
        console.log("Delete success!");
        this.users = this.users.filter(user => user._id !== userId);
        this.toastr.success('User deleted', 'Success');
      },
      error: (error)=>{
        console.error('Error deleting user details:', error);
        this.toastr.error('Failed to delete user', 'Error');
      }
    })
  }
}
