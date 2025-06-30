import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CalendarModule } from 'primeng/calendar';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    CalendarModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  formData: any = {
    firstName: '',
    lastName: '',
    username: '',
    gender: null,
    dateOfBirth: null,
    phoneNumber: '',
    email: '',
    password: ''
  };

  genderOptions: any[] = [];
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.genderOptions = [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Prefer not to say', value: 'not_to_say' },
      { label: 'Other', value: 'other' }
    ];
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onCreate() {
    // YENİ: Backend'e gitmeden önce son bir kontrol.
    // Formdaki herhangi bir değerin boş veya null olup olmadığını kontrol ediyoruz.
    if (Object.values(this.formData).some(value => value === null || value === '')) {
      this.errorMessage = "Lütfen tüm alanları eksiksiz doldurunuz.";
      return; // Fonksiyonun devam etmesini engelle.
    }

    this.errorMessage = '';

    // const payload = {
    //   ...this.formData,
    //   gender: this.formData.gender ? this.formData.gender.value : null
    // };

     console.log('Servise gönderilecek veri:', this.formData);

    this.authService.register(this.formData).subscribe({
      next: (response) => {
        console.log('Kayıt başarılı!', response);
        alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.error || 'Bir hata oluştu. Lütfen tekrar deneyin.';
        console.error(err);
      }
    });
  }
}
