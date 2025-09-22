import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { visitanteAccessGuard } from './visitante-access.guard';

describe('visitanteAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => visitanteAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
