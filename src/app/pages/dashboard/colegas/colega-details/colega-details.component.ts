import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { ColegaDetails } from 'src/app/features/colegas/colegas.model';
import { ColegaService } from 'src/app/features/colegas/colegas.service';
import { CurrentStatus } from 'src/app/current-status';

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

  _colegaUID = "";
  @Input("uid") set colegaUID(uid: string) {
    this.showColegaDetails(uid);
  }
  get colegaUID(): string {
    return this._colegaUID;
  }

  constructor(
    private colegaService: ColegaService
  ) {}

  // Colega Details
  colegaDetails?: ColegaDetails;
  showColegaDetails(colegaUID: string) {
    if(!colegaUID) return;
    if(CurrentStatus.DEBUG_MODE) console.log("[COLEGA_DETAILS_PAGE] ShowColegaDetails: DOING");

    this.isLoading = true;

    this.colegaService.getColegaDetails(colegaUID)
      .pipe(
        finalize(() => {
          this.isLoading = false; // Desliga animação
        })
      )
      .subscribe({
        next: (data) => {
          this.colegaDetails = data;
          if(CurrentStatus.DEBUG_MODE) console.log("[COLEGA_DETAILS_PAGE] ShowColegaDetails: DONE");
        },
        error: (error) => {
          this.error = error; // Informa erro
          if(CurrentStatus.DEBUG_MODE) console.log("[COLEGA_DETAILS_PAGE] ShowColegaDetails: ERROR");
          if(CurrentStatus.DEBUG_MODE) console.log(error);
        }
      });
  }

  // Contatos
  getContato(contatoName: string) {
    return this.colegaDetails?.contacts?.find(contact => (contact.name === contatoName));
  }
}
