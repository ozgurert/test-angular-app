import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Textarea } from 'primeng/textarea';
import { PostService } from '../services/post.service';
import { PostViewDto } from '../dto/post-view.dto';
import { PostCreateDto } from '../dto/post-create.dto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RouterLink,
    ReactiveFormsModule,
    Textarea
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public otherUsers: any[] = [];
  public myProfile: any | null = null;
  public loggedInUsername: string | null = null;
  public postForm: FormGroup;
  public posts: PostViewDto[] = [];

  constructor(
    private dashboardService: DashboardService,
    private postService: PostService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(280)]]
    });
  }

  ngOnInit(): void {
    this.setLoggedInUser();
    if (this.loggedInUsername) {
      this.getUsers();
      this.loadPosts();
    }
  }

  setLoggedInUser(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.loggedInUsername = decodedToken.sub;
      } catch (error) {
        console.error("Geçersiz token bulundu, çıkış yapılıyor.", error);
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  getUsers(): void {
    this.dashboardService.getUsers().subscribe({
      next: (allUsers) => {
        this.myProfile = allUsers.find(user => user.username === this.loggedInUsername);
        this.otherUsers = allUsers.filter(user => user.username !== this.loggedInUsername);
      },
      error: (err) => {
        console.error("Kullanıcı verileri çekilirken hata oluştu:", err);
        if (err.status === 401 || err.status === 403) {
          this.logout();
        }
      }
    });
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (err) => {
        console.error("Gönderiler çekilirken hata oluştu:", err);
      }
    });
  }

  // DÜZENLENDİ: Gönderi paylaşma metodu artık backend'e istek atıyor.
  submitPost(): void {
    if (this.postForm.invalid) {
      return;
    }
    const postData: PostCreateDto = this.postForm.value;
    this.postService.createPost(postData).subscribe({
      next: () => {
        console.log("Gönderi başarıyla oluşturuldu.");
        this.postForm.reset(); // Formu temizle
        this.loadPosts(); // Yeni gönderiyi görmek için listeyi anında güncelle
      },
      error: (err) => {
        console.error("Gönderi oluşturulurken hata oluştu:", err);
        // Kullanıcıya bir hata mesajı gösterilebilir.
      }
    });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
