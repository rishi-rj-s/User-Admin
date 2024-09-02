import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthServices } from '../../services/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ProfileState } from '../../states/profile/profile.reducer';
import { selectProfileEmail, selectProfileName, selectProfileId } from '../../states/profile/profile.selector';
import { loginSuccess } from '../../states/profile/profile.actions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})


export class ProfileComponent implements OnInit, OnDestroy  {
  profilePic: SafeUrl | null = null;
  defaultPic = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';
  name$: Observable<string | null>;
  email$: Observable<string | null>;
  id$: Observable<string | undefined>;
  private subscriptions: Subscription[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private authService: AuthServices,
    private sanitizer: DomSanitizer,
    private store: Store<{ profile: ProfileState }>
  ) {
    this.name$ = this.store.select(selectProfileName);
    this.email$ = this.store.select(selectProfileEmail);
    this.id$ = this.store.select(selectProfileId);
  }

  ngOnInit(): void {
    const storedProfilePic = this.authService.getProfilePic();
    const userDetails = this.authService.getUserDetails();

    if (userDetails) {
      const picUrl = storedProfilePic && storedProfilePic !== 'false'
        ? `http://localhost:3000/${storedProfilePic}?${new Date().getTime()}`
        : this.defaultPic;

      this.profilePic = this.sanitizer.bypassSecurityTrustUrl(picUrl);
      this.store.dispatch(loginSuccess({ user: userDetails }));
    } else {
      this.profilePic = this.sanitizer.bypassSecurityTrustUrl(this.defaultPic);
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const subscription = this.id$.subscribe((id) => {
        this.authService.uploadProfilePicture(file, id).subscribe({
          next: (response: any) => {
            console.log('Profile picture updated successfully:', response);
            const newPicUrl = `http://localhost:3000/${response.filePath}?${new Date().getTime()}`;
            this.profilePic = this.sanitizer.bypassSecurityTrustUrl(newPicUrl);
            this.authService.storeProfilePic(response.filePath);
            input.value = '';
          },
          error: (err) => {
            console.error('Error updating profile picture:', err);
          }
        });
      });
      this.subscriptions.push(subscription);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
