import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PasskeyService {
  // Set to empty strings by default instead of null
  private passkey: string = '';
  private magicNumber: number | null = null;

  // Set the passkey
  setPasskey(key: string): void {
    if (!key) {
      throw new Error('Passkey cannot be empty');
    }
    this.passkey = key;
  }

  // Get the passkey
  getPasskey(): string {
    if (!this.passkey) {
      throw new Error('Passkey is not set');
    }
    return this.passkey;
  }

  // Set the magic number
  setMagicNumber(number: number): void {
    if (number === null || number === undefined) {
      throw new Error('Magic number cannot be null or undefined');
    }
    this.magicNumber = number;
  }

  // Get the magic number
  getMagicNumber(): number {
    if (this.magicNumber === null) {
      throw new Error('Magic number is not set');
    }
    return this.magicNumber;
  }
}
