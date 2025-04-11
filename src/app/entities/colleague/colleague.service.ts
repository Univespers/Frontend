import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ColleagueEndpointService } from 'src/app/endpoints/colleague-endpoint.service';
import { Colleague, ColleagueDetails } from './colleague.model';

@Injectable({
  providedIn: 'root'
})
export class ColleagueService {

  constructor(
    private colleagueEndpointService: ColleagueEndpointService
  ) {}

  getColleague(id: string): Observable<Colleague> {
    return this.colleagueEndpointService.getColleague(id).pipe(
      map(data => Colleague.getColleague(data))
    );
  }

  getColleagueDetails(id: string): Observable<ColleagueDetails> {
    return this.colleagueEndpointService.getColleagueDetails(id).pipe(
      map(data => ColleagueDetails.getColleagueDetails(data))
    );
  }

  getAllColleagues(): Observable<Colleague[]> {
    return this.colleagueEndpointService.getAllColleagues().pipe(
      map(data => Colleague.getColleagueList(data))
    );
  }

}
