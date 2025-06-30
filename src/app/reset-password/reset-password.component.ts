import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../services/auth.service';

// PrimeNG Modülleri
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Şifrelerin eşleşip eşleşmediğini kontrol eden özel bir validator fonksiyonu
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ProgressSpinnerModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: passwordMatchValidator });

  token: string | null = null;
  message: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
      if (!this.token) {
        this.errorMessage = "Geçersiz veya eksik şifre sıfırlama linki.";
      }
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid || !this.token) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.message = null;
    this.errorMessage = null;

    const newPassword = this.resetPasswordForm.get('password')?.value ?? '';

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.message = response.message || 'Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Bir hata oluştu. Lütfen tekrar deneyin.';
      }
    });
  }

  // YENİ EKLENEN METOT
  goBackToLogin(): void {
    this.router.navigate(['/login']); // veya /signin
  }
  // BİTTİ

  get passwordControl() { return this.resetPasswordForm.get('password'); }
  get confirmPasswordControl() { return this.resetPasswordForm.get('confirmPassword'); }
}
