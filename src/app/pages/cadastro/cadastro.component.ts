import { AfterContentInit, Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { catchError, finalize, of, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { RequiresSave } from 'src/app/features/requires-save.interface';
import { StepperComponent } from 'src/app/components/stepper/stepper.component';
import { UserDadosFormComponent } from './user-dados-form/user-dados-form.component';
import { UserContatosFormComponent } from './user-contatos-form/user-contatos-form.component';
import { UserCursoFormComponent } from './user-curso-form/user-curso-form.component';
import { Theme, ThemeService } from 'src/app/features/theme.service';
import { AuthService } from 'src/app/features/auth/auth.service';
import { PerfilService } from 'src/app/features/perfil/perfil.service';
import { CurrentStatus } from 'src/app/current-status';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StepperComponent,
    UserDadosFormComponent,
    UserContatosFormComponent,
    UserCursoFormComponent,
    LoadingComponent
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements AfterContentInit, RequiresSave {

  public isLoading = false;
  public error = "";

  @ViewChild("cadastroForm") cadastroForm?: NgForm;
  public userDadosForm?: NgForm;
  public userContatosForm?: NgForm;
  public userCursoForm?: NgForm;

  constructor(
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) platformId: Object,
    private authService: AuthService,
    private perfilService: PerfilService,
    private router: Router,
  ) {
    this.isLoading = isPlatformServer(platformId);
  }

  ngAfterContentInit() {
    if(CurrentStatus.DEBUG_MODE) console.log("[CADASTRO_PAGE] Update theme");
    this.themeService.setBackgroundTheme(Theme.Dark);
  }

  // UnSaved message
  isChanged = false;
  alertMessage = "Campos preenchidos serão perdidos! Deseja mesmo sair?";
  hasUnsavedChanges() {
    return this.isChanged;
  }

  // Stepper
  currentStep: number = 0;
  nextStep() {
    if(this.isLastStep()) {
      console.log(this.cadastroForm?.ngSubmit);
      this.cadastroForm?.ngSubmit.emit(); // Trigger submit
    } else this.currentStep++;
  }
  isLastStep(): boolean {
    return (this.currentStep === 2);
  }

  // Forms
  getUserDadosForm(form: NgForm) {
    this.userDadosForm = form;
  }
  getUserContatosForm(form: NgForm) {
    this.userContatosForm = form;
  }
  getUserCursoForm(form: NgForm) {
    this.userCursoForm = form;
  }
  submit(userDadosForm?: NgForm, userContatosForm?: NgForm, userCursoForm?: NgForm) {
    this.isLoading = true;
    if(!userDadosForm || !userContatosForm || !userCursoForm) {
      this.isLoading = false;
      return;
    }
    if(CurrentStatus.DEBUG_MODE) console.log("[CADASTRO_PAGE] Submit: DOING");

    if(CurrentStatus.DEBUG_MODE) console.log("[CADASTRO_PAGE] User Dados Form:");
    if(CurrentStatus.DEBUG_MODE) console.log(userDadosForm.value);
    if(CurrentStatus.DEBUG_MODE) console.log("[CADASTRO_PAGE] isFormValid: " + userDadosForm.valid);
    if(CurrentStatus.DEBUG_MODE) console.log("[CADASTRO_PAGE] User Contatos Form:");
    if(CurrentStatus.DEBUG_MODE) console.log(userContatosForm.value);
    if(CurrentStatus.DEBUG_MODE) console.log("[CADASTRO_PAGE] isFormValid: " + userContatosForm.valid);
    if(CurrentStatus.DEBUG_MODE) console.log("[CADASTRO_PAGE] User Curso Form:");
    if(CurrentStatus.DEBUG_MODE) console.log(userCursoForm.value);
    if(CurrentStatus.DEBUG_MODE) console.log("[CADASTRO_PAGE] isFormValid: " + userCursoForm.valid);

    // if(!userDadosForm.valid || !userContatosForm.valid || !userCursoForm.valid) { // TODO: (Cadastro) Validar
    //   this.isLoading = false;
    //   return;
    // };

    const nome = userDadosForm.value.nome;
    const emailInstitucional = userDadosForm.value.emailInstitucional;
    const telefone = userDadosForm.value.telefone;
    const showTelefone = userDadosForm.value.showTelefone;
    const telIsWhatsapp = userDadosForm.value.telIsWhatsapp;
    const senha = userDadosForm.value.senha;
    const senhaConfirmation = userDadosForm.value.senhaConfirmation;
    const descricao = userDadosForm.value.descricao;
    const showDescricao = userDadosForm.value.showDescricao;

    const emailPessoal = userContatosForm.value.emailPessoal;
    const showEmailPessoal = userContatosForm.value.showEmailPessoal;
    const linkedin = userContatosForm.value.linkedin;
    const showLinkedIn = userContatosForm.value.showLinkedIn;
    const facebook = userContatosForm.value.facebook;
    const showFacebook = userContatosForm.value.showFacebook;
    const instagram = userContatosForm.value.instagram;
    const showInstagram = userContatosForm.value.showInstagram;
    const discord = userContatosForm.value.discord;
    const showDiscord = userContatosForm.value.showDiscord;
    const github = userContatosForm.value.github;
    const showGitHub = userContatosForm.value.showGitHub;
    const reddit = userContatosForm.value.reddit;
    const showReddit = userContatosForm.value.showReddit;

    const curso = userCursoForm.value.curso;
    const polo = userCursoForm.value.polo;
    const semesterAtual = userCursoForm.value.semesterAtual;
    const interesses = userCursoForm.value.interesses;
    const habilidades = userCursoForm.value.habilidades;
    const materiasCursando = userCursoForm.value.materiasCursando;

    // if(!senha || senha !== senhaConfirmation) {
    //   this.isLoading = false;
    //   return;
    // }

    this.cadastro({
      senha, senhaConfirmation,
      nome, emailInstitucional, telefone, telIsWhatsapp, descricao,
      showTelefone, showDescricao,
      curso, polo, semesterAtual, interesses, habilidades, materiasCursando,
      emailPessoal, linkedin, facebook, instagram, discord, github, reddit,
      showEmailPessoal, showLinkedIn, showFacebook, showInstagram, showDiscord, showGitHub, showReddit
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data) => {
          userDadosForm.reset(); // Reset forms
          userContatosForm.reset();
          userCursoForm.reset();
          if(CurrentStatus.DEBUG_MODE) console.log("[CADASTRO_PAGE] Submit: DONE");
        },
        error: (error) => {
          this.error = error; // Informa erro
          if(CurrentStatus.DEBUG_MODE) console.log("[CADASTRO_PAGE] Submit: ERROR");
          if(CurrentStatus.DEBUG_MODE) console.log(error);
        }
      });
  }

  // Cadastro
  cadastro(dados: any) {
    console.log(dados);
    return of(true).pipe(
      switchMap(data => this.authService.cadastro(dados.emailInstitucional, dados.senha)),
      //switchMap(data => this.authService.login(institutionalEmail, password)), // Já é feito em cadastro
      // switchMap(data => this.perfilService.createPerfil(dados.nome, dados.emailInstitucional, dados.curso, dados.polo)),
      // switchMap(data => this.perfilService.editPerfil(
      //   dados.nome, dados.emailInstitucional, dados.telefone, dados.telIsWhatsapp, dados.descricao,
      //   dados.showTelefone, dados.showDescricao,
      //   dados.curso, dados.polo, dados.semesterAtual, dados.interesses, dados.habilidades, dados.materiasCursando,
      //   dados.emailPessoal, dados.linkedin, dados.facebook, dados.instagram, dados.discord, dados.github, dados.reddit,
      //   dados.showEmailPessoal, dados.showLinkedIn, dados.showFacebook, dados.showInstagram, dados.showDiscord, dados.showGitHub, dados.showReddit)),
      tap(() => {
        switch(true) {
          case this.authService.isUserEstudante():
            this.redirectToColegas()
            break;
        }
        if(CurrentStatus.DEBUG_MODE) console.log("[CADASTRO_PAGE] Cadastro: DONE");
      }),
      catchError((error) => {
        if(CurrentStatus.DEBUG_MODE) console.log("[CADASTRO_PAGE] Cadastro: ERROR");
        if(CurrentStatus.DEBUG_MODE) console.log(error);
        return throwError(() => error);
      })
    );
  }

  // Redirects
  redirectToColegas() {
    if(CurrentStatus.DEBUG_MODE) console.log("[LOGIN_PAGE] Redirect to Colegas");
    this.router.navigate([ "/colegas" ]);
  }

}
