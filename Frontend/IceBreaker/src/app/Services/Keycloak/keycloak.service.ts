import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  private _keycloak: Keycloak|undefined;

  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
          realm: 'IceBreaker',
          url: 'http://localhost:8081',
          clientId: 'first_client_Icebreaker'
        }
      )
    }
    return this._keycloak;
  }

  constructor() { }

  async init() {

    const authenticated: boolean = await this.keycloak?.init({ onLoad: 'login-required' });
    if (authenticated) {

    } else {
      console.error('Failed to authenticate with Keycloak');
    }

  }


  logout() {
    this.keycloak?.logout(  { redirectUri: 'http://localhost:4200' });
  }
}
