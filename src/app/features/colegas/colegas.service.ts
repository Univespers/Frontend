import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ColegasEndpointService } from 'src/app/features/colegas/colegas-endpoint.service';
import { Colega, ColegaDetails, ColegaList } from './colegas.model';

@Injectable({
  providedIn: 'root'
})
export class ColegaService {

  constructor(
    private colegaEndpointService: ColegasEndpointService
  ) {}

  getColega(uid: string): Observable<Colega> {
    return this.colegaEndpointService.getColega(uid).pipe(
      map(data => Colega.getColega(data))
    );
  }

  getColegaDetails(uid: string): Observable<ColegaDetails> {
    return this.colegaEndpointService.getColegaDetails(uid).pipe(
      map(data => ColegaDetails.getColegaDetails(data))
    );
  }

  searchColegas(searchQuery: string, pageSize: number, indexUID: string = "", direction?: "prev"|""|"next"): Observable<ColegaList> {
    return this.colegaEndpointService.searchColegas(searchQuery, pageSize, indexUID, direction).pipe(
      map(data => ColegaList.getColegaList(data))
    );
  }

}
