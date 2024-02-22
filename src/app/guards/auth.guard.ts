import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/user/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  //si el token es nulo, redirigimos al usuario a la pagina de bienvenida
  if(auth.authorization$().token == null){
    router.navigate(['welcome']);
    return false;
  }
  //si el token no es nulo, permitimos el acceso a la ruta
  return true;
};
