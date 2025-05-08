import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ColleagueEndpointService } from 'src/app/endpoints/colleague-endpoint.service';
import { Colleague, ColleagueDetails, ColleagueList } from './colleague.model';

@Injectable({
  providedIn: 'root'
})
export class ColleagueService {

  constructor(
    private colleagueEndpointService: ColleagueEndpointService
  ) {}

  getColleague(uuid: string): Observable<Colleague> {
    return this.colleagueEndpointService.getColleague(uuid).pipe(
      map(data => Colleague.getColleague(data))
    );
  }

  getColleagueDetails(uuid: string): Observable<ColleagueDetails> {
    return this.colleagueEndpointService.getColleagueDetails(uuid).pipe(
      map(data => ColleagueDetails.getColleagueDetails(data))
    );
  }

  searchColleagues(query: string, page: number): Observable<ColleagueList> {
    return this.colleagueEndpointService.searchColleagues(query, page).pipe(
      map(data => ColleagueList.getColleagueList(data))
    );
  }

}
