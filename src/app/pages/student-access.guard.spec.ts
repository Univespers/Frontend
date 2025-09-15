import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { studentAccessGuard } from './student-access.guard';

describe('studentAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => studentAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
