import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

// Gerekli HttpClient ve Interceptor importları
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor'; // Bizim yazdığımız interceptor

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    // Mevcut provider'larınız
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'false'
        }
      }
    }),

    // --- EN ÖNEMLİ KISIM ---
    // HttpClient'ı, 'withInterceptors' fonksiyonu ile birlikte sağlıyoruz.
    // Bu, Angular'a "tüm HTTP isteklerinde 'authInterceptor'ı kullan" demenin en modern yoludur.
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
