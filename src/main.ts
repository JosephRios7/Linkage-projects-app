import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/interceptors/auth.interceptor'; // Asegúrate de tener el interceptor creado

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Proveedor para las rutas definidas en app.routes.ts
    provideHttpClient(), // Habilita HttpClient para las solicitudes HTTP
    {
      provide: HTTP_INTERCEPTORS, // Configura el interceptor para las solicitudes HTTP
      useClass: AuthInterceptor,
      multi: true, // Permite múltiples interceptores
    },
  ],
}).catch((err) => console.error(err));
