import * as CryptoJS from 'crypto-js';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root' // This ensures the service is available application-wide
})
export class PasskeySec {
  private keySize: number = 256 / 32; // AES-256 key size (32 bytes)
  private ivSize: number = 128 / 32; // AES block size (16 bytes)
  private modValue: number = 1e12 +33; // Modulus value for key derivation

  hashPasskey(passkey: string, number: number): string {
    const combined = `${passkey}:${number}`;
    return CryptoJS.SHA256(combined).toString(CryptoJS.enc.Hex);
  }

  encryptPrivateKey(privKey: string, passkey: string, number: number): string {
    const derivedKey = this.deriveKey(passkey, number);
    return CryptoJS.AES.encrypt(privKey, derivedKey).toString();
  }


  decryptPrivateKey(privKey: string, passkey: string, number: number): string {
    const derivedKey = this.deriveKey(passkey, number);
    const decrypted = CryptoJS.AES.decrypt(privKey, derivedKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }


  private deriveKey(passkey: string, number: number): string {
    const powered = BigInt(passkey.length) ** BigInt(number) % BigInt(this.modValue);
    return CryptoJS.SHA256(powered.toString()).toString(CryptoJS.enc.Hex); // Changed to Hex
  }
}
