import { Component } from '@angular/core';
import { ThemeService } from 'src/app/utils/theme.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {

  public isBackgroundDark = false;

  constructor(private themeService: ThemeService) {
    themeService.isBackgroundDark().subscribe((value) => {
      this.isBackgroundDark = value;
    });
  }

}
