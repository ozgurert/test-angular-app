// src/app/pages/login/ozgur.component.ts

import {Component} from '@angular/core';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {Router} from '@angular/router';
import {ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-ozgur',
  standalone: true,
  imports: [
    Button,
    InputText,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './ozgur.component.html',
  styleUrl: './ozgur.component.css'
})
export class OzgurComponent {

  // İYİLEŞTİRME: showError boolean'ı yerine doğrudan hata mesajını tutalım.
  errorMessage: string | null = null;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onForgotPassword() {
    this.router.navigate(['/forgotpassword']);
  }

  onCreateAccount() {
    this.router.navigate(['/signup']);
  }

  onLogin() {
    this.errorMessage = null; // Hata mesajını her denemede sıfırla
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Giriş başarılı, token alındı:', response.token);
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login servisi hata döndürdü:', err);
        // İYİLEŞTİRME: Backend'den gelen spesifik hata mesajını ata.
        this.errorMessage = err.error.error || 'Geçersiz kullanıcı adı veya parola.';
      }
    });
  }
}
