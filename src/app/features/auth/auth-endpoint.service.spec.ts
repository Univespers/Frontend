import { TestBed } from '@angular/core/testing';

import { AuthEndpointService } from './auth-endpoint.service';

describe('AuthEndpointService', () => {
  let service: AuthEndpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthEndpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
