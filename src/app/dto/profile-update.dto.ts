// Bu dosya, backend'e bir profili güncellemek için hangi verileri göndereceğimizi tanımlar.
export interface ProfileUpdateDto {
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  phoneNumber: string;
}
