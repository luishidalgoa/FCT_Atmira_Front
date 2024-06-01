import { ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch()), // Habilita el uso de fetch APIs
    provideAnimations(),
    provideAnimationsAsync()
  ]
};
