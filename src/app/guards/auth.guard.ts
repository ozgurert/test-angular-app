import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * Bu "guard", bir rotanın etkinleştirilip etkinleştirilemeyeceğini kontrol eder.
 * Sadece giriş yapmış (localStorage'da token'ı olan) kullanıcıların
 * belirli sayfalara erişmesine izin vermek için kullanılır.
 */
export const authGuard: CanActivateFn = (route, state) => {

  // Router servisini "inject" ederek kullanıma hazır hale getiriyoruz.
  const router = inject(Router);

  // Tarayıcının hafızasından 'authToken'i kontrol et.
  const token = localStorage.getItem('authToken');

  if (token) {
    // Eğer token varsa, kullanıcı giriş yapmış demektir.
    // Sayfaya erişime izin ver.
    return true;
  } else {
    // Eğer token yoksa, kullanıcı giriş yapmamış demektir.
    // Kullanıcıyı '/login' sayfasına yönlendir.
    router.navigate(['/login']);
    // Sayfaya erişimi engelle.
    return false;
  }
};
