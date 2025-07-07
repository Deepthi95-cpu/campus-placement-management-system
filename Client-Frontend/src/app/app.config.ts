import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http'; // <-- Import provideHttpClient
import { provideMarkdown } from 'ngx-markdown'; // <-- Import provideMarkdown

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()), // <-- Provide HttpClient (needed by ngx-markdown)
    provideMarkdown() // <-- Provide Markdown services
    // ... other providers if any
  ]
};