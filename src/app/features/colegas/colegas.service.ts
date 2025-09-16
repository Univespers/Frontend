import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ColegaEndpointService } from 'src/app/features/colegas/colegas-endpoint.service';
import { Colega, ColegaDetails, ColegaList } from './colegas.model';

@Injectable({
  providedIn: 'root'
})
export class ColegaService {

  constructor(
    private colegaEndpointService: ColegaEndpointService
  ) {}

  getColega(uuid: string): Observable<Colega> {
    return this.colegaEndpointService.getColega(uuid).pipe(
      map(data => Colega.getColega(data))
    );
  }

  getColegaDetails(uuid: string): Observable<ColegaDetails> {
    return this.colegaEndpointService.getColegaDetails(uuid).pipe(
      map(data => ColegaDetails.getColegaDetails(data))
    );
  }

  searchColegas(query: string, page: number): Observable<ColegaList> {
    return this.colegaEndpointService.searchColegas(query, page).pipe(
      map(data => ColegaList.getColegaList(data))
    );
  }

}
