import { Routes } from '@angular/router';

import { LoginComponent } from './pages/guest_domain/login/login.component';
import { SigninComponent } from './pages/guest_domain/signin/signin.component';
import { DashboardComponent } from './pages/student_domain/dashboard/dashboard.component';
import { ColleaguesComponent } from './pages/student_domain/colleagues/colleagues.component';
import { ProfileComponent } from './pages/student_domain/profile/profile.component';
import { ProfileEditComponent } from './pages/student_domain/profile-edit/profile-edit.component';
import { LogoutComponent } from './pages/student_domain/logout/logout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { routeGuard } from './pages/route.guard';
import { studentAccessGuard } from './pages/student_domain/student-access.guard';
import { guestAccessGuard } from './pages/guest_domain/guest-access.guard';
import { unsavedChangesGuard } from './pages/unsaved-changes.guard';

export const routes: Routes = [

  // Redirect to login/colegas
  { path: "", redirectTo: "redirect", pathMatch: "full" },
  { path: "redirect", component: NotFoundComponent, canActivate: [ routeGuard ] },

  // Guest only
  { path: "", children: [
    { path: "login", component: LoginComponent },
    { path: "cadastro", component: SigninComponent, canDeactivate: [ unsavedChangesGuard ] },
  ], canActivateChild: [ guestAccessGuard ]},

  // Student only
  { path: "", component: DashboardComponent, children: [
    { path: "colegas", component: ColleaguesComponent },
    { path: "perfil", component: ProfileComponent },
    { path: "perfil/editar", component: ProfileEditComponent, canDeactivate: [ unsavedChangesGuard ] },
    { path: "logout", component: LogoutComponent },
  ], canActivateChild: [ studentAccessGuard ]},

  // Not found page
  { path: "**", component: NotFoundComponent }

];
