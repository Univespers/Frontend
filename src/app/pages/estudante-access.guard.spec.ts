import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { estudanteAccessGuard } from './estudante-access.guard';

describe('estudanteAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => estudanteAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
