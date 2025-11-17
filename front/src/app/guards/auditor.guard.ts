import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuditorGuard: CanActivateFn = (route, state) => {
  const _auth  =  inject(AuthService);
  const _router  =  inject(Router);
  if(_auth.getAuthUser() && _auth.getAuthUser().id && _auth.getAuthUser().role === "AUDITOR" ){
    return true;
  }
  _router.navigate(['/unauthorized'])
  return false;
};
