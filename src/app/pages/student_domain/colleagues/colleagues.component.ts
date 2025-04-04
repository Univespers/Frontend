import { AfterContentInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Theme, ThemeService } from 'src/app/utils/theme.service';
import { ColleagueList } from 'src/app/entities/colleague/colleague-list.model';
import { Colleague } from 'src/app/entities/colleague/colleague.model';

@Component({
  selector: 'app-colleagues',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './colleagues.component.html',
  styleUrl: './colleagues.component.scss'
})
export class ColleaguesComponent implements AfterContentInit {

  constructor(private themeService: ThemeService) {}

  ngAfterContentInit() {
    this.themeService.setBackgroundTheme(Theme.Light);
  }

  // Colleagues
  public getColleagues() {
    return new ColleagueList([
      new Colleague("Aluno1", "EMAIL", "Curso", "Polo"),
      new Colleague("Aluno2", "EMAIL", "Curso", "Polo"),
      new Colleague("Aluno3", "EMAIL", "Curso", "Polo"),
      new Colleague("Aluno4", "EMAIL", "Curso", "Polo"),
      new Colleague("Aluno5", "EMAIL", "Curso", "Polo"),
      new Colleague("Aluno6", "EMAIL", "Curso", "Polo"),
      new Colleague("Aluno7", "EMAIL", "Curso", "Polo"),
      new Colleague("Aluno8", "EMAIL", "Curso", "Polo"),
      new Colleague("Aluno9", "EMAIL", "Curso", "Polo"),
    ]).list;
  }

}
