import { Routes } from '@angular/router';

import { LoginComponent } from './pages/guest_domain/login/login.component';
import { SigninComponent } from './pages/guest_domain/signin/signin.component';
import { ColleaguesComponent } from './pages/student_domain/colleagues/colleagues.component';
import { ProfileComponent } from './pages/student_domain/profile/profile.component';
import { ProfileEditComponent } from './pages/student_domain/profile-edit/profile-edit.component';
import { LogoutComponent } from './pages/student_domain/logout/logout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { studentAccessGuard } from './pages/student_domain/student-access.guard';
import { guestAccessGuard } from './pages/guest_domain/guest-access.guard';
import { unsavedChangesGuard } from './pages/unsaved-changes.guard';

export const routes: Routes = [

  // Visitor only
  { path: "", pathMatch: "full", redirectTo: "login", canMatch: [ guestAccessGuard ] },
  { path: "", children: [
    { path: "login", component: LoginComponent },
    { path: "signin", component: SigninComponent, canDeactivate: [ unsavedChangesGuard ] },
  ], canActivateChild: [ guestAccessGuard ]},

  // Student only
  { path: "", pathMatch: "full", redirectTo: "colleagues", canMatch: [ studentAccessGuard ] },
  { path: "", children: [
    { path: "colleagues", component: ColleaguesComponent },
    { path: "profile", component: ProfileComponent },
    { path: "profile/edit", component: ProfileEditComponent, canDeactivate: [ unsavedChangesGuard ] },
    { path: "logout", component: LogoutComponent },
  ], canActivateChild: [ studentAccessGuard ]},

  // All
  { path: "not-found", component: NotFoundComponent },
  { path: "**", redirectTo: "not-found" }

];
