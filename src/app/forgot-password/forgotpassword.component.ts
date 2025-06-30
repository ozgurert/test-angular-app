import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service'; // YENİ: Servis import edildi

// Gerekli PrimeNG Modülleri
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // YENİ: Yükleniyor animasyonu için

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    ProgressSpinnerModule, // YENİ: Import eklendi
  ],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent implements OnDestroy {

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
  });

  // --- YENİ: Durum Yönetimi İçin Değişkenler ---
  isLoading = false; // API isteği sırasında true olur
  message: string | null = null; // Başarı mesajı
  errorMessage: string | null = null; // Hata mesajı
  // ---

  isButtonDisabled = false; // Geri sayım için
  countdown = 30;
  private timer: any;

  // YENİ: AuthService constructor'a eklendi
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  get emailControl() {
    return this.forgotPasswordForm.get('email');
  }

  // YENİ: Metodun adı onSubmit olarak değiştirildi ve servis mantığı eklendi
  onSubmit(): void {
    if (this.forgotPasswordForm.invalid || this.isButtonDisabled) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.message = null;
    this.errorMessage = null;

    const email = this.forgotPasswordForm.value.email ?? '';

    this.authService.requestPasswordReset(email).subscribe({
      next: (response) => {
        this.isLoading = false;
        // DEĞİŞİKLİK: Artık response bir JSON nesnesi. İçindeki "message" alanını oku.
        this.message = response.message || 'Eğer e-posta adresi sistemimizde kayıtlıysa, şifre sıfırlama linki gönderilmiştir.';
        this.forgotPasswordForm.reset();
        this.startCountdown();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Bir hata oluştu. Lütfen tekrar deneyin.';
        this.isButtonDisabled = false;
        clearInterval(this.timer);
      }
    });
  }

  // YENİ: Geri sayım mantığı ayrı bir metoda taşındı
  private startCountdown(): void {
    this.isButtonDisabled = true;
    this.countdown = 30;

    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.isButtonDisabled = false;
      }
    }, 1000);
  }

  goBackToLogin(): void {
    this.router.navigate(['/login']);
  }
}
