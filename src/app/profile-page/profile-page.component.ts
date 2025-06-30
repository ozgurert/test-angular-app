import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; // RouterLink eklendi
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service'; // YENİ: AuthService eklendi
import { UserViewDto } from '../dto/user-view.dto';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    ButtonModule,
    RouterLink // YENİ: imports dizisine eklendi
  ],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  user: UserViewDto | null = null;
  isLoading = true;
  userNotFound = false;
  activeTab: 'posts' | 'likes' = 'posts';

  // YENİ: Görüntülenen profilin mevcut kullanıcıya ait olup olmadığını tutar.
  isOwnProfile = false;
  private loggedInUsername: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService // YENİ: AuthService enjekte edildi
  ) { }

  ngOnInit(): void {
    // Giriş yapmış kullanıcının adını alıyoruz.
    this.loggedInUsername = this.authService.getUsernameFromToken();

    this.route.params.subscribe(params => {
      const usernameFromUrl = params['username'];
      if (usernameFromUrl) {
        // YENİ: URL'deki kullanıcı adı ile giriş yapmış olanı karşılaştırıyoruz.
        this.isOwnProfile = this.loggedInUsername === usernameFromUrl;
        this.loadUserProfile(usernameFromUrl);
      } else {
        this.isLoading = false;
        this.userNotFound = true;
      }
    });
  }

  loadUserProfile(username: string): void {
    this.isLoading = true;
    this.userNotFound = false;

    this.userService.getPublicUserProfile(username).subscribe({
      next: (data: UserViewDto) => {
        this.user = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error("Profil bilgisi çekilirken hata:", err);
        this.userNotFound = true;
        this.isLoading = false;
      }
    });
  }
}
