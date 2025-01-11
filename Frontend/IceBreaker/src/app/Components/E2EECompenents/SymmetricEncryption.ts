import * as CryptoJS from 'crypto-js'; // For AES encryption/decryption
import { encryptData as encryptRSA } from './Encryption';
import { decryptData as decryptRSA } from './Decryption';

export class EncryptionService {
  /**
   * Generate a symmetric key and return it as a Base64 string.
   * The generated key is 256 bits (32 bytes) for AES-256.
   */
  static generateSymmetricKey(): string {
    const key = CryptoJS.lib.WordArray.random(32); // 256-bit key
    return key.toString(CryptoJS.enc.Base64); // Convert to Base64 string
  }

  static encryptMessage(message: string, symmetricKey: string): string {
    if (!message || !symmetricKey) {
      throw new Error('Message and symmetric key are required for encryption.');
    }

    // Convert the symmetric key from Base64 string to WordArray
    const keyWordArray = CryptoJS.enc.Base64.parse(symmetricKey);

    // Create an initialization vector (IV) for AES encryption
    const iv = CryptoJS.lib.WordArray.random(16);

    // Encrypt the message with AES using the symmetric key and IV
    const encrypted = CryptoJS.AES.encrypt(message, keyWordArray, { iv });

    // Combine IV and the encrypted message into one string for storage
    const result = iv.toString(CryptoJS.enc.Base64) + ':' + encrypted.toString();

    return result; // Return the encrypted message as a string
  }

  static decryptMessage(encryptedMessage: string, symmetricKey: string): string {
    if (!encryptedMessage || !symmetricKey) {
      throw new Error('Encrypted message and symmetric key are required for decryption.');
    }

    // Split the input into the IV and the encrypted data
    const parts = encryptedMessage.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted message format.');
    }
    const iv = CryptoJS.enc.Base64.parse(parts[0]); // Decode the IV from Base64
    const ciphertext = parts[1]; // The actual encrypted data

    // Convert the symmetric key from Base64 string to WordArray
    const keyWordArray = CryptoJS.enc.Base64.parse(symmetricKey);

    // Decrypt the ciphertext with AES using the symmetric key and IV
    const bytes = CryptoJS.AES.decrypt(ciphertext, keyWordArray, { iv });

    // Return the decrypted message as a string
    const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedMessage) {
      throw new Error('Decryption failed. Ensure the symmetric key and encrypted message are valid.');
    }

    return decryptedMessage;
  }


  /**
   * Encrypt a symmetric key with the recipient's public key using RSA.
   * @param symmetricKey - The symmetric key in Base64 format.
   * @param recipientPublicKey - The recipient's public RSA key.
   * @returns The encrypted symmetric key as a Base64 string.
   */
  static async encryptSymmetricKey(symmetricKey: string, recipientPublicKey: string): Promise<string> {
    if (!symmetricKey || !recipientPublicKey) {
      throw new Error('Symmetric key and recipient public key are required for RSA encryption.');
    }

    // Encrypt the symmetric key (which is a Base64 string) using RSA
    return encryptRSA(symmetricKey, recipientPublicKey);
  }

  /**
   * Decrypt a symmetric key with the recipient's private key using RSA.
   * @param encryptedSymmetricKey - The encrypted symmetric key in Base64 format.
   * @param recipientPrivateKey - The recipient's private RSA key.
   * @returns The decrypted symmetric key as a Base64 string.
   */
  static async decryptSymmetricKey(encryptedSymmetricKey: string, recipientPrivateKey: string): Promise<string> {
    if (!encryptedSymmetricKey || !recipientPrivateKey) {
      throw new Error('Encrypted symmetric key and recipient private key are required for RSA decryption.');
    }

    // Decrypt the symmetric key using RSA
    const decryptedKeyBase64 = await decryptRSA(encryptedSymmetricKey, recipientPrivateKey);

    // Validate the decrypted key
    if (!decryptedKeyBase64) {
      throw new Error('Decryption failed. Ensure the encrypted symmetric key and private key are valid.');
    }
    return decryptedKeyBase64;
  }
}
