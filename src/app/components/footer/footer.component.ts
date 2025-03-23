import { Component } from '@angular/core';

import { CurrentStatus } from 'src/app/current-status';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  groupName = CurrentStatus.GROUP_NAME;
  currentYear = CurrentStatus.CURRENT_YEAR;
  currentVersion = CurrentStatus.CURRENT_VERSION;
}
