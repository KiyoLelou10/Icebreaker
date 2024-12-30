import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PrivateKeyService {
  // Set to an empty string by default instead of null
  private privateKey: string = '';

  // Set the private key
  setPrivateKey(key: string): void {
    if (!key) {
      throw new Error('Private key cannot be empty');
    }
    this.privateKey = key;
  }

  // Get the private key
  getPrivateKey(): string {
    if (!this.privateKey) {
      throw new Error('Private key is not set');
    }
    return this.privateKey;
  }
}

