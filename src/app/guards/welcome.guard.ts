import { CanActivateFn } from '@angular/router';

export const welcomeGuard: CanActivateFn = (route, state) => {
  return true;
};
