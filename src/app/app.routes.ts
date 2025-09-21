import { Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { ColegasComponent } from './pages/dashboard/colegas/colegas.component';
import { PerfilComponent } from './pages/dashboard/perfil/perfil.component';
import { PerfilEditComponent } from './pages/dashboard/perfil-edit/perfil-edit.component';
import { ChatComponent } from './pages/dashboard/chat/chat.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { routeGuard } from './pages/route.guard';
import { estudanteAccessGuard } from './pages/estudante-access.guard';
import { visitanteAccessGuard } from './pages/visitante-access.guard';
import { unsavedChangesGuard } from './pages/unsaved-changes.guard';
import { authResolver } from './features/auth/auth.resolver';

export const routes: Routes = [

  // Redirect to login/colegas
  { path: "", redirectTo: "redirect", pathMatch: "full" },
  { path: "redirect", component: NotFoundComponent, canActivate: [ routeGuard ] },

  // Guest only
  { path: "", children: [
    { path: "login", component: LoginComponent },
    { path: "cadastro", component: CadastroComponent, canDeactivate: [ unsavedChangesGuard ] },
  ], resolve:{ authData: authResolver}, canActivateChild: [ visitanteAccessGuard ]},

  // Student only
  { path: "", component: DashboardComponent, children: [
    { path: "perfil", component: PerfilComponent },
    { path: "perfil/editar", component: PerfilEditComponent, canDeactivate: [ unsavedChangesGuard ] },
    { path: "colegas", component: ColegasComponent },
    { path: "chat", component: ChatComponent },
    { path: "logout", component: LogoutComponent },
  ], resolve:{ authData: authResolver}, canActivateChild: [ estudanteAccessGuard ]},

  // Not found page
  { path: "**", component: NotFoundComponent }

];
