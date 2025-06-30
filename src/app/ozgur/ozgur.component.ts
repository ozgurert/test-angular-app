import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// GEREKLİ PRİMENEG MODÜLLERİ
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-ozgur',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  templateUrl: './ozgur.component.html',
  styleUrl: './ozgur.component.css'
})
export class OzgurComponent {

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
    this.router.navigate(['/forgot-password']);
  }

  onCreateAccount() {
    this.router.navigate(['/signup']);
  }

  onLogin() {
    this.errorMessage = null;
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
        this.errorMessage = err.error.error || 'Geçersiz kullanıcı adı veya parola.';
      }
    });
  }
}
