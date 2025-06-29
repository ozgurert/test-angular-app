import { Routes } from '@angular/router';
import { OzgurComponent } from './ozgur/ozgur.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', component: OzgurComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
