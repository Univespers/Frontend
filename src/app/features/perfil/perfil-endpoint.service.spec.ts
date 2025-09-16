import { TestBed } from '@angular/core/testing';

import { PerfilEndpointService } from './perfil-endpoint.service';

describe('PerfilEndpointService', () => {
  let service: PerfilEndpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfilEndpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
