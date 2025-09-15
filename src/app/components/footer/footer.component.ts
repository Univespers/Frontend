import { Component } from '@angular/core';

import { CurrentStatus } from 'src/app/current-status';
import { ThemeService } from 'src/app/features/theme.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  public groupName = CurrentStatus.GROUP_NAME;
  public currentYear = CurrentStatus.CURRENT_YEAR;
  public currentVersion = CurrentStatus.CURRENT_VERSION;

  public isBackgroundDark = false;

  constructor(private themeService: ThemeService) {
    themeService.isBackgroundDark().subscribe((value) => {
      this.isBackgroundDark = value;
    });
  }
}
