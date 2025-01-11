import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {CryptographyService} from '../../../Services/CryptographyServices/cryptography.service';
import {KeycloakService} from '../../../Services/Keycloak/keycloak.service';
import {PasskeySec} from '../../E2EECompenents/PasskeySec';
import {PasskeyService} from '../../../Services/CryptographyServices/Passkey.service';
import {PrivateKeyService} from '../../../Services/UserProfile/PrivateKey.service';
import {generateKeyPair} from '../../E2EECompenents/KeyGenerate';


@Component({
  selector: 'app-passphrase-dialog',
  standalone: true,
  imports: [
    MatFormField,
    MatDialogContent,
    NgIf,
    FormsModule,
    MatInput,
    MatDialogActions,
    MatButton,
    MatLabel
  ],
  providers: [PasskeySec],
  templateUrl: './passphrase-dialog.component.html',
  styleUrl: './passphrase-dialog.component.css'
})
export class PassphraseDialogComponent implements OnInit {
  passphrase: string = '';
  confirmPassphrase: string = '';
  magicNumber: number | null = null;
  confirmMagicNumber: number | null = null;
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<PassphraseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cryptographyService: CryptographyService,
    private keycloakService: KeycloakService,
    private passKeySec : PasskeySec,
    private privateKeyService: PrivateKeyService
  ) {}

  ngOnInit(): void {
    if (!this.data.isNew) {
      this.cryptographyService.getMagicNumber().subscribe({
        next: (number) => {
          this.magicNumber = number;
          console.log('Fetched magic number:', this.magicNumber);
        },
        error: (error) => {
          console.error('Error fetching magic number:', error);
        },
      });
    }
  }
  onCancel(): void {
    this.keycloakService.logout();
  }

  async onSave(): Promise<void> {
    if (this.data.isNew) {
      if (!this.passphrase || !this.confirmPassphrase) {
        this.errorMessage = 'Passphrase cannot be empty!';
        return;
      }
      if (this.passphrase !== this.confirmPassphrase) {
        this.errorMessage = 'Passphrases do not match!';
        return;
      }
      if (this.magicNumber === null || this.confirmMagicNumber === null) {
        this.errorMessage = 'Magic number cannot be empty!';
        return;
      }
      if (this.magicNumber !== this.confirmMagicNumber) {
        this.errorMessage = 'Magic numbers do not match!';
        return;
      }

      const hashedPassphrase = this.passKeySec.hashPasskey(this.passphrase, this.magicNumber);
      console.log(hashedPassphrase);
      this.cryptographyService
        .updatePassphrase({
          passphrase: hashedPassphrase,
          magicNumber: this.magicNumber,
        })
        .subscribe(
          () => {
            this.dialogRef.close({
              passphrase: hashedPassphrase,
              magicNumber: this.magicNumber,
            });
          },
          (error) => {
            this.errorMessage = 'Error saving passphrase. Please try again.';
          }
        );
      const keyPair = await generateKeyPair();
      console.log('New key pair generated:', keyPair);
      const encryptedPrivateKey = this.passKeySec.encryptPrivateKey(keyPair.privateKey, this.passphrase, this.magicNumber);
      this.cryptographyService.uploadKeyPair(keyPair.publicKey, encryptedPrivateKey).subscribe({
        next: () => {
          console.log('Key pair uploaded successfully.');
        },
        error: (err) => {
          console.error('Failed to upload key pair:', err);
        },
      });
      this.privateKeyService.setPrivateKey(keyPair.privateKey);
    } else {
      // Validation for verifying passphrase
      if (!this.passphrase) {
        this.errorMessage = 'Passphrase cannot be empty!';
        return;
      }
      // @ts-ignore
      const hashedPassphrase = this.passKeySec.hashPasskey(this.passphrase, this.magicNumber)
      this.cryptographyService.verifyPassphrase(hashedPassphrase).subscribe(
        () => {
          this.dialogRef.close({ passphrase: hashedPassphrase });
        },
        () => {

          this.errorMessage = 'Incorrect passphrase. Please try again.';
        }
      );
      this.cryptographyService.getMyPrivKey().subscribe({
        next: (key: string) => {
          // @ts-ignore
          const decryptedKey = this.passKeySec.decryptPrivateKey(key, this.passphrase, this.magicNumber);
          this.privateKeyService.setPrivateKey(decryptedKey);
        },
        error: (error: any) => {
          console.error('Error decrypting private key:', error);
        }
      });
    }
  }

}
