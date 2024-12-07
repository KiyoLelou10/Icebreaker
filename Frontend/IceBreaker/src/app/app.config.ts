import {APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {KeycloakService} from './Services/Keycloak/keycloak.service';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {httpTokenInterceptorInterceptor} from './Interceptors/HttpTokenInterceptor/http-token-interceptor.interceptor';


export function keycloakFactory(kcService: KeycloakService) {
  return () => kcService.init();
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: keycloakFactory,
      deps: [KeycloakService],
      multi: true
    },
    provideHttpClient(withInterceptors( [ httpTokenInterceptorInterceptor] ))
  ]
};
