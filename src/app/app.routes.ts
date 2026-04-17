import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { RegisterComponent } from './components/register/register.component';
import { Login } from './components/login/login';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password';
import { ResetPasswordComponent } from './components/reset-password/reset-password';
import { RegisteredAgentsComponent } from './components/registered-agents/registered-agents.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'registered-agents', component: RegisteredAgentsComponent }
];