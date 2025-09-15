import { Component, Input } from '@angular/core';
import { ThemeService } from 'src/app/features/theme.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {

  @Input() cover = false;

  public isBackgroundDark = false;

  constructor(private themeService: ThemeService) {
    themeService.isBackgroundDark().subscribe((value) => {
      this.isBackgroundDark = value;
    });
  }

}
