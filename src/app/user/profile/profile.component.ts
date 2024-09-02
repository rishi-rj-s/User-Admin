import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthServices } from '../../services/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})


export class ProfileComponent implements OnInit {
  profilePic: SafeUrl | null = null;
  defaultPic = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp'; 
  name: string | null = null;
  email: string | null = null;
  id?: string;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private authService: AuthServices, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      const picUrl = userDetails.pic ? `http://localhost:3000/${userDetails.pic}` : this.defaultPic;
      this.profilePic = this.sanitizer.bypassSecurityTrustUrl(picUrl);
      this.name = userDetails.name;
      this.email = userDetails.email;
      this.id = userDetails.id;
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      this.authService.uploadProfilePicture(file, this.id).subscribe({
        next: (response: any) => {
          console.log('Profile picture updated successfully:', response);
          const newPicUrl = `http://localhost:3000/${response.filePath}`; 
          this.profilePic = this.sanitizer.bypassSecurityTrustUrl(newPicUrl);

          const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
          userDetails.pic = response.filePath; 
          localStorage.setItem('userDetails', JSON.stringify(userDetails));
        },
        error: (err) => {
          console.error('Error updating profile picture:', err);
        }
      });
    }
  }
}