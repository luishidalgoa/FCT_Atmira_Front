import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/mockup/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if(!auth.currentUser$()){
    router.navigate(['welcome']);
    return false;
  }
  return true;
};
