import { AfterContentInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Theme, ThemeService } from 'src/app/utils/theme.service';
import { ColleagueList } from 'src/app/entities/colleague/colleague-list.model';
import { Colleague } from 'src/app/entities/colleague/colleague.model';
import { ColleagueService } from 'src/app/entities/colleague/colleague.service';
import { finalize, map } from 'rxjs';
import { ColleagueListResponse, ColleagueResponse } from 'src/app/endpoints/colleague-endpoint.service';

@Component({
  selector: 'app-colleagues',
  standalone: true,
  imports: [ CommonModule ],
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
  colleaguesList: ColleagueResponse[] = [];
  public getColleagues() {
    console.log("ListAllCollegues");
    this.isLoading = true;
    this.colleagueService.getAllColleagues().pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (data) => {
        console.log("OK"); // TODO: Deletar
        this.colleaguesList = data.list;
      },
      error: (error) => {
        console.log(error); // TODO: Deletar
        this.error = error;
      }
    });
  }

}
