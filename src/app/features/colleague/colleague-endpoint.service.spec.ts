import { TestBed } from '@angular/core/testing';

import { ColleagueEndpointService } from './colleague-endpoint.service';

describe('ColleaguesEndpointService', () => {
  let service: ColleagueEndpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColleagueEndpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
