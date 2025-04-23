import { AfterContentInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { Theme, ThemeService } from 'src/app/utils/theme.service';
import { Colleague } from 'src/app/entities/colleague/colleague.model';
import { ColleagueService } from 'src/app/entities/colleague/colleague.service';
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
    this.getColleagues();
  }

  ngAfterContentInit() {
    this.themeService.setBackgroundTheme(Theme.Light);
  }

  // Colleagues
  colleaguesList: Colleague[] = [];
  public getColleagues() {
    console.log("ListAllCollegues"); // TODO: Deletar
    this.isLoading = true;
    this.colleagueService.searchColleagues("", 1).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (data) => {
        console.log("OK"); // TODO: Deletar
        this.colleaguesList = data;
      },
      error: (error) => {
        console.log(error); // TODO: Deletar
        this.error = error;
      }
    });
  }

  // Colleague Details
  colleagueDetailsUUID = "";
  showDialog = false;
  showColleagueDetails(colleagueUUID: string) {
    this.colleagueDetailsUUID = colleagueUUID;
    this.showDialog = true;
  }

}
