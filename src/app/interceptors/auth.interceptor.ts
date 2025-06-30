import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Bu fonksiyonel interceptor, uygulamadan çıkan her HTTP isteğini yakalar
 * ve eğer kullanıcı giriş yapmışsa, isteğin başlığına JWT'yi ekler.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // 1. Tarayıcının yerel hafızasından (localStorage) 'authToken'i al.
  const authToken = localStorage.getItem('authToken');

  console.log("Auth Interceptor çalıştı! Yakalanan istek:", req.url);

  // 2. Eğer token mevcutsa...
  if (authToken) {
    // Mevcut isteği değiştiremeyeceğimiz için onu klonluyoruz.
    // Klonlanmış isteğin başlığına 'Authorization' bilgisini ekliyoruz.
    // Bu, backend'e "Ben kimliği doğrulanmış bir kullanıcıyım" demenin standart yoludur.
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    // Üzerinde değişiklik yapılmış yeni isteğin yoluna devam etmesini sağlıyoruz.
    return next(clonedReq);
  }

  // 3. Eğer token yoksa (kullanıcı giriş yapmamışsa veya herkese açık bir sayfa ise),
  // orijinal isteğe hiç dokunmadan yoluna devam etmesini sağlıyoruz.
  return next(req);
};
