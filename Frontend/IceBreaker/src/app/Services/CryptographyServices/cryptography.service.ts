import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptographyService {
  constructor(private http: HttpClient) {}

  checkPassphraseStatus(): Observable<any> {
    return this.http.get('http://localhost:8080/cryptography/passphrase/status');
  }

  updatePassphrase(data: { passphrase: string; magicNumber: number }): Observable<any> {
    return this.http.post('http://localhost:8080/cryptography/passphrase/update', data);
  }

  verifyPassphrase(passphrase: string): Observable<any> {
    return this.http.post('http://localhost:8080/cryptography/passphrase/verify', { passphrase });
  }
}
