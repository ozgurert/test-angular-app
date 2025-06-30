// src/app/dto/post-view.dto.ts
import { UserViewDto } from "./user-view.dto";

export interface PostViewDto {
  id: number;
  content: string;
  createdAt: string;
  author: UserViewDto;
  likeCount: number;
  commentCount: number;
}
