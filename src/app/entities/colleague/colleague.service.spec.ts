import { TestBed } from '@angular/core/testing';

import { ColleagueService } from './colleague.service';

describe('ColleagueService', () => {
  let service: ColleagueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColleagueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
