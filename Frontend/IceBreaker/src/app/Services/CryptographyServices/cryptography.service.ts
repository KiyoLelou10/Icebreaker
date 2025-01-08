import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptographyService {
  constructor(private http: HttpClient) {}

  checkPassphraseStatus(): Observable<any> {
    return this.http.get('http://localhost:8080/cryptography/passphrase/status');
  }

  updatePassphrase(data: { passphrase: string; magicNumber: number }): Observable<any> {
    console.log('Payload sent to backend:', data);
    return this.http.post('http://localhost:8080/cryptography/passphrase/update', data);
  }

  verifyPassphrase(passphrase: string): Observable<any> {
    return this.http.post('http://localhost:8080/cryptography/passphrase/verify', { passphrase });
  }
  getMagicNumber(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/cryptography/passphrase/magicNumber');
  }

  uploadKeyPair(publicKey: string, privateKey: string): Observable<void> {
    const payload = { publicKey, privateKey };
    return this.http.post<void>('http://localhost:8080/api/profile/uploadKeyPair', payload).pipe(
      catchError((error) => {
        console.error('Error uploading key pair:', error);
        return throwError(() => new Error('Failed to upload key pair'));
      })
    );
  }

  getMyPrivKey(): Observable<string> {
    return this.http.get('http://localhost:8080/api/profile/fetchMyPrivKey', { responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('Error fetching private key:', error);
        return throwError(() => new Error('Failed to fetch private key'));
      })
    );
  }

}
