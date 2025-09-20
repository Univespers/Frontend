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
import { CurrentStatus } from 'src/app/current-status';

@Component({
  selector: 'app-colegas',
  standalone: true,
  imports: [ CommonModule, ColegaDetailsComponent, ButtonPopupMenuComponent, LoadingComponent, PopupDialogComponent ],
  templateUrl: './colegas.component.html',
  styleUrl: './colegas.component.scss'
})
export class ColegasComponent implements AfterContentInit, OnInit {

  static PAGE_SIZE = 10;

  isLoading = false;
  error = "";

  constructor(
    private themeService: ThemeService,
    private colegaService: ColegaService
  ) {}

  ngOnInit() {
    this.search(""); // Inicialmente lista todos
  }

  ngAfterContentInit() {
    if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_PAGE] Update theme");
    this.themeService.setBackgroundTheme(Theme.Light);
  }

  // Search colegas
  colegasList: Colega[] = [];
  public search(query: string) {
    if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_PAGE] Search: DOING");
    let searchRequest;
    if(this.pageDirection) {
      searchRequest = this.colegaService.searchColegas(query, ColegasComponent.PAGE_SIZE, this.currentPageIndexUID, this.pageDirection);
    } else {
      searchRequest = this.colegaService.searchColegas(query, ColegasComponent.PAGE_SIZE);
    }
    searchRequest.pipe(
      finalize(() => {
        this.isLoading = false;
        this.pageDirection = "";
      })
    ).subscribe({
      next: (data) => {
        if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_PAGE] Search: DONE");
        if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_PAGE] List: ");
        if(CurrentStatus.DEBUG_MODE) console.log(data.list);
        if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_PAGE] Page size: " + data.list.length);
        if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_PAGE] Total pages: " + data.totalPages);
        if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_PAGE] Index UID: " + data.indexUID);
        if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_PAGE] IsLastPage: " + data.isLastPage);
        this.colegasList = data.list;
        this.totalPages = data.totalPages;
        this.currentPageIndexUID = data.indexUID;
        this.isLastPage = data.isLastPage;
      },
      error: (error) => {
        if(CurrentStatus.DEBUG_MODE) console.log("[COLEGAS_PAGE] Search: ERROR");
        if(CurrentStatus.DEBUG_MODE) console.log(error);
        this.error = error;
      }
    });
  }
  public research(query: string) {
    this.resetSearch();
    this.search(query);
  }
  public resetSearch() {
    this.currentPageIndexUID = "";
    this.pageDirection = "";
    this.pageOffset = 0;
    this.totalPages = 0;
    this.isLastPage = false;
  }

  // Paginador
  currentPageIndexUID = "";
  pageDirection: "prev"|""|"next" = "";
  pageOffset = 0;
  totalPages = 0;
  isLastPage = false;
  prevPage() {
    this.pageOffset--;
    this.pageDirection = "prev";
  }
  nextPage() {
    this.pageOffset++;
    this.pageDirection = "next";
  }

  // Colega Details
  colegaDetailsUID = "";
  showDialog = false;
  showColegaDetails(colegaUID: string) {
    this.colegaDetailsUID = colegaUID;
    this.showDialog = true;
  }

}
