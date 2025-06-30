import { Routes } from '@angular/router';
import { OzgurComponent } from './ozgur/ozgur.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotpasswordComponent } from './forgot-password/forgotpassword.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: OzgurComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotpasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'profile/edit', component: EditProfileComponent, canActivate: [authGuard] },
  { path: 'profile/:username', component: ProfilePageComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
