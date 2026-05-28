import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { addIcons } from 'ionicons';
import {
  personCircleOutline,
  lockClosedOutline,
  lockOpenOutline,
  menuOutline
} from 'ionicons/icons';
import { httpInterceptor } from './app/core/interceptors/http.interceptor';

addIcons({
  personCircleOutline,
  lockClosedOutline,
  lockOpenOutline,
  menuOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpInterceptor])
    ),
  ],
});
