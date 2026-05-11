import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiKeyInterceptor } from './app/interceptors/api-key-interceptor';
import { provideRouter } from '@angular/router';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig).catch(err => console.error(err));
