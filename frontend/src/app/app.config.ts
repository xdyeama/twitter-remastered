import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AngularCropperjsModule } from 'angular-cropperjs';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthService } from './services/auth.service';
import { ImageService } from './services/image.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JWTInterceptor } from './services/jwt_interceptor';
import { MatIconModule } from '@angular/material/icon';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideIcons, provideNgIconsConfig } from '@ng-icons/core';
import { heroChatBubbleOvalLeft, heroHeart } from '@ng-icons/heroicons/outline';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    { provide: AuthService, useClass: AuthService },
    { provide: ImageService, useClass: ImageService },
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(AngularCropperjsModule),
    importProvidersFrom(MatIconModule),
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true }, provideAnimationsAsync(),
    AuthService,
    provideHttpClient(withFetch()),
    provideIcons({ heroChatBubbleOvalLeft, heroHeart }),
    provideNgIconsConfig({
      size: '1.5em',
    })
  ]
};
