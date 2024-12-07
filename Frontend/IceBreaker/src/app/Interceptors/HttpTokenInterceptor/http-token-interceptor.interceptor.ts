import {HttpHeaders, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {KeycloakService} from '../../Services/Keycloak/keycloak.service';



export const httpTokenInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(KeycloakService);
  const token = keycloak.keycloak?.token; // Retrieve the token using getToken()

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(authReq);
  }

  return next(req);
};
