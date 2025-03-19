import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { SigninComponent } from './pages/signin/signin.component';
import { ColleaguesComponent } from './pages/student_domain/colleagues/colleagues.component';
import { ProfileComponent } from './pages/student_domain/profile/profile.component';
import { ProfileEditComponent } from './pages/student_domain/profile-edit/profile-edit.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';


export const routes: Routes = [

    // Visitor only
    { path: "login", component: LoginComponent },
    { path: "signin", component: SigninComponent },

    // Student only
    { path: "colleagues", component: ColleaguesComponent },
    { path: "profile", component: ProfileComponent },
    { path: "profile/edit", component: ProfileEditComponent },

    // All
    { path: "not-found", component: NotFoundComponent },
    { path: "**", redirectTo: "not-found" }

];
