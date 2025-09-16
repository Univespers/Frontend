import { TestBed } from '@angular/core/testing';

import { ColegaService } from './colegas.service';

describe('ColegaService', () => {
  let service: ColegaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColegaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
