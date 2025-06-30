// src/app/services/post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// DTO'ları birazdan oluşturacağız
import { PostViewDto } from '../dto/post-view.dto';
import { PostCreateDto } from '../dto/post-create.dto';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<PostViewDto[]> {
    return this.http.get<PostViewDto[]>(this.apiUrl);
  }

  createPost(postData: PostCreateDto): Observable<void> {
    return this.http.post<void>(this.apiUrl, postData);
  }
}
