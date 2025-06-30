import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; //


@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent implements OnDestroy {

  // Formumuzu ve içindeki 'email' alanını tanımlıyoruz
  forgotPasswordForm = new FormGroup({
    // email alanı için FormControl oluşturuyoruz.
    // İlk parametre başlangıç değeri (''), ikinci parametre ise doğrulama kuralları.
    email: new FormControl('', [
      Validators.required, // Bu alanın doldurulması zorunlu
      Validators.email     // Girilen değerin e-posta formatında olması zorunlu
    ]),
  });

  isButtonDisabled = false;
  countdown = 0;
  private timer: any;

  constructor(private router: Router) {} // <-- YENİ

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  // HTML'den email kontrolüne daha kolay erişmek için bir getter
  get emailControl() {
    return this.forgotPasswordForm.get('email');
  }

  sendResetLink(): void {
    // FONKSİYONUN BAŞINDAKİ EN ÖNEMLİ KONTROL
    // Eğer form geçerli değilse (boş veya email formatında değilse) hiçbir şey yapma.
    if (this.forgotPasswordForm.invalid) {
      // Kullanıcıya hatayı göstermek için formu 'touched' olarak işaretleyebiliriz.
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    // Eğer form geçerliyse, e-postayı buradan alabiliriz:
    const email = this.forgotPasswordForm.value.email;
    console.log(`Sıfırlama linki "${email}" adresine gönderiliyor...`);
    // API isteğinizi burada yapabilirsiniz.

    // Sayaç ve buton pasifleştirme mantığı artık sadece form geçerliyken çalışacak.
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
