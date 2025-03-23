import { TestBed } from '@angular/core/testing';

import { ProfileEndpointService } from './profile-endpoint.service';

describe('ProfileEndpointService', () => {
  let service: ProfileEndpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileEndpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
