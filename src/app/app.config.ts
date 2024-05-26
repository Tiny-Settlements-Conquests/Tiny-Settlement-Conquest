import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { Actions, provideEffects, provideEffectsManager } from '@ngneat/effects-ng';
import { devTools } from '@ngneat/elf-devtools';
import { routes } from './app.routes';
import { RoundCountdownEffects } from './domain/round/domain/state/countdown/round-countdown.effects';
import { ActionHistoryEffects } from './domain/action-history/domain/state/action-history.effects';

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
    provideEffectsManager(),
    provideEffects(
      RoundCountdownEffects, 
      ActionHistoryEffects
    ),
    provideAnimations(),
  ]
};
