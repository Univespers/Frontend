import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColleagueDetailsResponse, ColleagueEndpointService, ColleagueListResponse, ColleagueResponse } from 'src/app/endpoints/colleague-endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class ColleagueService {

  constructor(
    private colleagueEndpointService: ColleagueEndpointService
  ) {}

  getColleague(id: string): Observable<ColleagueResponse> {
    return this.colleagueEndpointService.getColleagueDetails(id);
  }

  getColleagueDetails(id: string): Observable<ColleagueDetailsResponse> {
    return this.colleagueEndpointService.getColleagueDetails(id);
  }

  getAllColleagues(): Observable<ColleagueListResponse> {
    return this.colleagueEndpointService.getAllColleagues();
  }

}
