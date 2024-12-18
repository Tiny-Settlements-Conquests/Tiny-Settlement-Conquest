import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Actions, provideEffects, provideEffectsManager } from '@ngneat/effects-ng';
import { devTools } from '@ngneat/elf-devtools';
import { routes } from './app.routes';
import { ActionHistoryEffects } from './domain/action-history/domain/state/action-history.effects';
import { RoundCountdownEffects } from './domain/round/domain/state/countdown/round-countdown.effects';
import { TradeEffects } from './domain/trade/domain/state/trade.effects';
import { provideDevToken } from './utils/tokens/dev.token';
import { provideVersionToken } from './utils/tokens/version.token';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EventQueueEffects } from './domain/response-queue/domain/state/event-queue.effects';

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
      ActionHistoryEffects,
      TradeEffects,
      EventQueueEffects
    ),
    provideAnimations(),
    provideAnimationsAsync(),
    provideDevToken(),
    provideVersionToken(),
    provideHttpClient(withInterceptorsFromDi())
  ]
};


