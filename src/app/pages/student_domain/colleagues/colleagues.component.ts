import { AfterContentInit, Component } from '@angular/core';
import { Theme, ThemeService } from 'src/app/utils/theme.service';

@Component({
  selector: 'app-colleagues',
  standalone: true,
  imports: [],
  templateUrl: './colleagues.component.html',
  styleUrl: './colleagues.component.scss'
})
export class ColleaguesComponent implements AfterContentInit {

  constructor(private themeService: ThemeService) {}

  ngAfterContentInit() {
    this.themeService.setBackgroundTheme(Theme.Light);
  }

}
