import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthServices } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})

export class AddUserComponent   {
  @Input() user: any = { name: '', email: '', id: '' };
  @Input() isEditMode: boolean = false;
  @Output() cancel = new EventEmitter<void>();

  constructor(private _authServices: AuthServices, private toastr: ToastrService) { }

  onSubmit(form: NgForm): void {
    if (this.isEditMode) {
      console.log(this.user)
      this._authServices.updateUser(this.user).subscribe({
        next: (response) => {
          this.toastr.success('User updated successfully', 'Success');
          this.cancel.emit();
        },
        error: (error) => {
          this.toastr.error('Failed to update user', 'Error');
        }
      });
    } else {
      this._authServices.registerUser(this.user.name, this.user.email, this.user.password).subscribe({
        next: (response) => {
          this.toastr.success('User added successfully', 'Success');
          this.cancel.emit();
        },
        error: (error) => {
          this.toastr.error('Failed to add user', 'Error');
        }
      });
    }
  }

  cancels(): void {
    this.cancel.emit();
  }
}
