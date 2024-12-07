import { CanActivateFn } from '@angular/router';
import {inject} from '@angular/core';
import {KeycloakService} from '../../Services/Keycloak/keycloak.service';
import {Router} from '@angular/router';
export const authGuardGuard: CanActivateFn = (route, state) => {
  const keycloakService= inject(KeycloakService);
  const router = inject(Router);
  if(keycloakService.keycloak?.isTokenExpired()){
    router.navigate(['/']);
    return false;
  }

  return true;
};
