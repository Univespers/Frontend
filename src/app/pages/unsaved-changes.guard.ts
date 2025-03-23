import { CanDeactivateFn } from '@angular/router';

import { RequiresSave } from 'src/app/utils/requires-save.interface';

export const unsavedChangesGuard: CanDeactivateFn<RequiresSave> = (component) => {
  if (component.hasUnsavedChanges()) {
    return window.confirm(component.alertMessage);
  }
  return true;
};
