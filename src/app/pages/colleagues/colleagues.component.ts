import { AfterContentInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { Theme, ThemeService } from 'src/app/features/theme.service';
import { Colleague } from 'src/app/features/colleague/colleague.model';
import { ColleagueService } from 'src/app/features/colleague/colleague.service';
import { ColleagueDetailsComponent } from './colleague-details/colleague-details.component';
import { ButtonPopupMenuComponent } from 'src/app/components/button-popup-menu/button-popup-menu.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { PopupDialogComponent } from 'src/app/components/popup-dialog/popup-dialog.component';

@Component({
  selector: 'app-colleagues',
  standalone: true,
  imports: [ CommonModule, ColleagueDetailsComponent, ButtonPopupMenuComponent, LoadingComponent, PopupDialogComponent ],
  templateUrl: './colleagues.component.html',
  styleUrl: './colleagues.component.scss'
})
export class ColleaguesComponent implements AfterContentInit, OnInit {

  isLoading = false;
  error = "";

  constructor(
    private themeService: ThemeService,
    private colleagueService: ColleagueService
  ) {}

  ngOnInit() {
    this.search("");
  }

  ngAfterContentInit() {
    this.themeService.setBackgroundTheme(Theme.Light);
  }

  // Search colleagues
  colleaguesList: Colleague[] = [];
  public search(searchWord: string) {
    this.colleagueService.searchColleagues(searchWord, this.currentPage).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (data) => {
        console.log("OK"); // TODO: Deletar
        this.colleaguesList = data.list;
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

  // Colleague Details
  colleagueDetailsUUID = "";
  showDialog = false;
  showColleagueDetails(colleagueUUID: string) {
    this.colleagueDetailsUUID = colleagueUUID;
    this.showDialog = true;
  }

}
