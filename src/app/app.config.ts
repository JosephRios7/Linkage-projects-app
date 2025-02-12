import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router'; // Importa provideRouter
import { authInterceptor } from './interceptors/auth.interceptor';
import { routes } from './app.routes';  // Asegúrate de que las rutas estén definidas en app.routes.ts

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor]) // Agrega interceptores si los necesitas
    ),
    provideRouter(routes), // Proporciona las rutas
  ],
};
