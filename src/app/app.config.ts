import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { Actions } from '@ngneat/effects-ng';
import { devTools } from '@ngneat/elf-devtools';


export function initElfDevTools(actions: Actions) {
  return () => {
    devTools({
      name: 'Sample Application',
      actionsDispatcher: actions
    })
  };
}

const provideElfDevTools = (() => 
  [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initElfDevTools,
      deps: [Actions]
    }
  ]
)

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideElfDevTools(),
    provideAnimations(),
  ]
};
