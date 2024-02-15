import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/user/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if(auth.authorization$().token == null){
    router.navigate(['welcome']);
    return false;
  }
  return true;
};
