import { TestBed } from '@angular/core/testing';

import { ColleaguesEndpointService } from './colleagues-endpoint.service';

describe('ColleaguesEndpointService', () => {
  let service: ColleaguesEndpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColleaguesEndpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
