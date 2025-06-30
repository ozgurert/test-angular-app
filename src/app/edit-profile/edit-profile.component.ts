import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

// PrimeNG Modülleri
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
// DÜZELTME: Doğru modül import edildi.
import { Textarea } from 'primeng/textarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    // DÜZELTME: Component'e doğru modül eklendi.
    Textarea,
    ProgressSpinnerModule,
    ToastModule,
    InputSwitchModule
  ],
  providers: [MessageService],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  profileForm: FormGroup;
  isLoading = true;
  isSaving = false;
  isUploading = false;
  profileImageUrl: string | null = null;
  currentUsername: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      bio: [''],
      location: [''],
      email: [{ value: '', disabled: true }],
      phoneNumber: [''],
      gender: [''],
      dateOfBirth: [''],
      visibilitySettings: this.fb.group({
        showEmail: [false],
        showPhoneNumber: [false],
        showGender: [false],
        showDateOfBirth: [false]
      })
    });
  }

  ngOnInit(): void {
    this.currentUsername = this.authService.getUsernameFromToken();
    if (!this.currentUsername) {
      this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Kullanıcı bilgisi alınamadı.' });
      this.isLoading = false;
      return;
    }
    this.loadInitialData(this.currentUsername);
  }

  loadInitialData(username: string): void {
    this.isLoading = true;
    const profileForEdit$ = this.userService.getProfileForEdit();
    const publicProfile$ = this.userService.getPublicUserProfile(username);

    forkJoin([profileForEdit$, publicProfile$]).subscribe({
      next: ([profileData, publicData]) => {
        // HATA AYIKLAMA: Backend'den gelen veriyi kontrol edelim.
        console.log("Backend'den gelen profil verisi:", profileData);

        this.profileForm.patchValue(profileData);
        this.profileImageUrl = publicData.profileImageUrl;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Profil verileri çekilirken bir hata oluştu:", err);
        this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Profil bilgileri yüklenirken bir hata oluştu.' });
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.currentUsername) {
      this.messageService.add({ severity: 'warn', summary: 'Uyarı', detail: 'Lütfen gerekli alanları doldurun.' });
      return;
    }
    this.isSaving = true;

    this.userService.updateProfile(this.currentUsername, this.profileForm.getRawValue()).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Profil başarıyla güncellendi!' });
      },
      error: (err) => {
        this.isSaving = false;
        this.messageService.add({ severity: 'error', summary: 'Hata', detail: err.error?.message || 'Profil güncellenirken bir hata oluştu.' });
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File | null = event.target.files?.[0];
    if (file && this.currentUsername) {
      this.isUploading = true;
      this.userService.uploadProfilePhoto(this.currentUsername, file).subscribe({
        next: (response) => {
          this.profileImageUrl = response.profileImageUrl + '?t=' + new Date().getTime();
          this.isUploading = false;
          this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Profil fotoğrafı güncellendi!' });
        },
        error: (err) => {
          this.isUploading = false;
          this.messageService.add({ severity: 'error', summary: 'Hata', detail: err.error?.message || 'Fotoğraf yüklenirken bir hata oluştu.' });
        }
      });
    }
  }

  goBackToProfile(): void {
    if (this.currentUsername) {
      this.router.navigate(['/profile', this.currentUsername]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
