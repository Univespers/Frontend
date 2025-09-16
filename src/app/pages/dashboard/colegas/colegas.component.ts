import { AfterContentInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { Theme, ThemeService } from 'src/app/features/theme.service';
import { Colega } from 'src/app/features/colegas/colegas.model';
import { ColegaService } from 'src/app/features/colegas/colegas.service';
import { ColegaDetailsComponent } from './colega-details/colega-details.component';
import { ButtonPopupMenuComponent } from 'src/app/components/button-popup-menu/button-popup-menu.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { PopupDialogComponent } from 'src/app/components/popup-dialog/popup-dialog.component';

@Component({
  selector: 'app-colegas',
  standalone: true,
  imports: [ CommonModule, ColegaDetailsComponent, ButtonPopupMenuComponent, LoadingComponent, PopupDialogComponent ],
  templateUrl: './colegas.component.html',
  styleUrl: './colegas.component.scss'
})
export class ColegasComponent implements AfterContentInit, OnInit {

  isLoading = false;
  error = "";

  constructor(
    private themeService: ThemeService,
    private colegaService: ColegaService
  ) {}

  ngOnInit() {
    this.search("");
  }

  ngAfterContentInit() {
    this.themeService.setBackgroundTheme(Theme.Light);
  }

  // Search colegas
  colegasList: Colega[] = [];
  public search(searchWord: string) {
    this.colegaService.searchColegas(searchWord, this.currentPage).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (data) => {
        console.log("OK"); // TODO: Deletar
        this.colegasList = data.list;
        this.totalPages = data.totalPages;
      },
      error: (error) => {
        console.log(error); // TODO: Deletar
        this.error = error;
      }
    });
  }

  // Paginator
  currentPage = 1;
  totalPages = 0;
  prevPage() {
    this.currentPage--;
    if(this.currentPage <= 1) this.currentPage = 1;
  }
  nextPage() {
    this.currentPage++;
    if(this.currentPage >= this.totalPages) this.currentPage = this.totalPages;
  }

  // Colega Details
  colegaDetailsUUID = "";
  showDialog = false;
  showColegaDetails(colegaUUID: string) {
    this.colegaDetailsUUID = colegaUUID;
    this.showDialog = true;
  }

}
