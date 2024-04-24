import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthService } from './auth.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideIcons, provideNgIconsConfig } from '@ng-icons/core';
import { heroChatBubbleOvalLeft, heroHeart } from '@ng-icons/heroicons/outline';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    AuthService,
    provideHttpClient(withFetch()),
    provideIcons({ heroChatBubbleOvalLeft, heroHeart }),
    provideNgIconsConfig({
      size: '1.5em',
    })
  ]
};
