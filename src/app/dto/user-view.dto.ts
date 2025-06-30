// Bu dosya, backend'den gelen bir kullanıcının nasıl görüneceğini tanımlar.
export interface UserViewDto {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  profileImageUrl: string;
}
