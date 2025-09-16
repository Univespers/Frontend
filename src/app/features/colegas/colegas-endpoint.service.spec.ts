import { TestBed } from '@angular/core/testing';

import { ColegasEndpointService } from './colegas-endpoint.service';

describe('ColegassEndpointService', () => {
  let service: ColegasEndpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColegasEndpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
