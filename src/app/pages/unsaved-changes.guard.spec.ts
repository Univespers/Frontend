import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { unsavedChangesGuard } from './unsaved-changes.guard';
import { RequiresSave } from '../features/requires-save.interface';

describe('unsavedChangesGuard', () => {
  const executeGuard: CanDeactivateFn<RequiresSave> = (...guardParameters) => 
      TestBed.runInInjectionContext(() => unsavedChangesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
