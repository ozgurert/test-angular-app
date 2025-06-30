// src/app/services/post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// DTO'ları birazdan oluşturacağız
import { PostViewDto } from '../dto/post-view.dto';
import { PostCreateDto } from '../dto/post-create.dto';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/api/posts`;

  constructor(private http: HttpClient) { }

  getPosts(): Observable<PostViewDto[]> {
    return this.http.get<PostViewDto[]>(this.apiUrl);
  }

  createPost(postData: PostCreateDto): Observable<void> {
    return this.http.post<void>(this.apiUrl, postData);
  }
}
