import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserViewDto } from '../dto/user-view.dto';
import { ProfileUpdateDto } from '../dto/profile-update.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserViewDto[]> {
    return this.http.get<UserViewDto[]>(this.apiUrl);
  }

  getPublicUserProfile(username: string): Observable<UserViewDto> {
    return this.http.get<UserViewDto>(`${this.apiUrl}/${username}`);
  }

  getProfileForEdit(): Observable<ProfileUpdateDto> {
    return this.http.get<ProfileUpdateDto>(`${this.apiUrl}/me`);
  }

  updateProfile(username: string, profileData: ProfileUpdateDto): Observable<UserViewDto> {
    return this.http.put<UserViewDto>(`${this.apiUrl}/${username}`, profileData);
  }

  uploadProfilePhoto(username: string, file: File): Observable<{ profileImageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<{ profileImageUrl:string }>(`${this.apiUrl}/${username}/photo`, formData);
  }
}
