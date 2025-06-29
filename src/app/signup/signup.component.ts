// src/app/pages/signup/signup.component.ts

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

  // DÜZELTME: Tüm form verileri bu tek nesnede tutuluyor.
  formData: any = {
    firstName: '',
    lastName: '',
    username: '',
    gender: null, // p-select'in nesnesini tutacak
    dateOfBirth: null, // p-calendar'ın Date nesnesini tutacak
    phoneNumber: '',
    email: '',
    password: ''
  };

  genderOptions: any[] = [];
  errorMessage: string = '';
  // Not: Component seviyesindeki gereksiz 'selectedGender' ve 'dateOfBirth' kaldırıldı.

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
    this.errorMessage = '';

    // DÜZELTME: Backend'e göndermeden önce veriyi temiz bir formata sokuyoruz.
    const payload = {
      ...this.formData,
      gender: this.formData.gender ? this.formData.gender.value : null // p-select nesnesinden sadece 'value' kısmını al
    };
    // Not: dateOfBirth alanı HttpClient tarafından otomatik olarak ISO string formatına çevrilir, bu genellikle yeterlidir.

    console.log('Servise gönderilecek veri:', payload);

    this.authService.register(payload).subscribe({
      next: (response) => {
        console.log('Kayıt başarılı!', response);
        alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // DÜZELTME: Backend'den gelen hata mesajını doğru yerden alıyoruz (Map<"error", ...>)
        this.errorMessage = err.error.error || 'Bir hata oluştu. Lütfen tekrar deneyin.';
        console.error(err);
      }
    });
  }
}
