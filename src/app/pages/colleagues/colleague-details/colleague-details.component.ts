import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { ColleagueDetails } from 'src/app/features/colleague/colleague.model';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { ColleagueService } from 'src/app/features/colleague/colleague.service';

@Component({
  selector: 'app-colleague-details',
  standalone: true,
  imports: [ CommonModule, LoadingComponent ],
  templateUrl: './colleague-details.component.html',
  styleUrl: './colleague-details.component.scss'
})
export class ColleagueDetailsComponent {

  isLoading = false;
  error = "";

  _colleagueUUID = "";
  @Input("uuid") set colleagueUUID(uuid: string) {
    this.showColleagueDetails(uuid);
  }
  get colleagueUUID(): string {
    return this._colleagueUUID;
  }

  constructor(
    private colleagueService: ColleagueService
  ) {}

  // Colleague Details
  colleagueDetails?: ColleagueDetails;
  showColleagueDetails(colleagueUUID: string) {
    if(!colleagueUUID) return;
    console.log("ColleagueDetails"); // TODO: Deletar
    this.isLoading = true;
    this.colleagueService.getColleagueDetails(colleagueUUID).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (data) => {
        console.log("OK"); // TODO: Deletar
        this.colleagueDetails = data;
      },
      error: (error) => {
        console.log(error); // TODO: Deletar
        this.error = error;
      }
    });
  }
}
