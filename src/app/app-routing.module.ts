import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UserGuard } from './auth-guards/user.guard';
import { ProfileComponent } from './user/profile/profile.component';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './auth-guards/admin.guard';
import { AuthGuard } from './auth-guards/auth.guards';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {path: '', component: LoginComponent, canActivate: [AuthGuard]},
  {path: 'home', component: UserComponent, canActivate: [UserGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [UserGuard]},
  {path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }