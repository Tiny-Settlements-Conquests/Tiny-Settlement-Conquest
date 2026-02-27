import { InjectionToken } from '@angular/core';
import { EventGateway } from '@catan/shared/models';

// Re-export existing tokens from original source to ensure they're the SAME instances
export { DEV_TOKEN, provideDevToken } from '../../../../../src/app/utils/tokens/dev.token';
export { EDITION_TOKEN, provideEditionToken } from '../../../../../src/app/utils/tokens/edition.token';
export { VERSION_TOKEN, provideVersionToken } from '../../../../../src/app/utils/tokens/version.token';

/**
 * Central EventGateway token — NEW, only available via @catan/core.
 * This replaces the old pattern of accessing GameSetupService.eventGateway directly.
 * Components inject this token to dispatch game actions.
 */
export const EVENT_GATEWAY_TOKEN = new InjectionToken<EventGateway>('EVENT_GATEWAY_TOKEN');
