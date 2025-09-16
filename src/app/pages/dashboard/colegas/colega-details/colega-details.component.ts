import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { ColegaDetails } from 'src/app/features/colegas/colegas.model';
import { ColegaService } from 'src/app/features/colegas/colegas.service';

@Component({
  selector: 'app-colega-details',
  standalone: true,
  imports: [ CommonModule, LoadingComponent ],
  templateUrl: './colega-details.component.html',
  styleUrl: './colega-details.component.scss'
})
export class ColegaDetailsComponent {

  isLoading = false;
  error = "";

  _colegaUUID = "";
  @Input("uuid") set colegaUUID(uuid: string) {
    this.showColegaDetails(uuid);
  }
  get colegaUUID(): string {
    return this._colegaUUID;
  }

  constructor(
    private colegaService: ColegaService
  ) {}

  // Colega Details
  colegaDetails?: ColegaDetails;
  showColegaDetails(colegaUUID: string) {
    if(!colegaUUID) return;
    console.log("ColegaDetails"); // TODO: Deletar
    this.isLoading = true;
    this.colegaService.getColegaDetails(colegaUUID).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (data) => {
        console.log("OK"); // TODO: Deletar
        this.colegaDetails = data;
      },
      error: (error) => {
        console.log(error); // TODO: Deletar
        this.error = error;
      }
    });
  }
}
