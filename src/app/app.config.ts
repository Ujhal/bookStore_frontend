 import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { JwtInterceptor } from './shared/shared_service/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router
    provideRouter(routes),

    // HTTP Client with interceptor
    provideHttpClient(withInterceptors([JwtInterceptor])),

    // Animations
    provideAnimationsAsync(),
    provideAnimations(),

    // Toastr notifications
    provideToastr(),

    // Browser modules
    importProvidersFrom(BrowserModule),
    importProvidersFrom(BrowserAnimationsModule),

    // Zone change detection optimization
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Client hydration (optional for SSR)
    provideClientHydration()
  ]
};