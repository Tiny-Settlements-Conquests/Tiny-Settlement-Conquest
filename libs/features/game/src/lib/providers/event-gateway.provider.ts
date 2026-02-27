import { Provider } from '@angular/core';
import { EVENT_GATEWAY_TOKEN, EDITION_TOKEN, Edition } from '@catan/core';
import { EventGateway } from '@catan/shared/models';

/**
 * Provides the EventGateway token based on the current edition.
 * 
 * - SINGLEPLAYER: Uses LocalEventGateway (provided after game initialization)
 * - MULTIPLAYER: Uses RemoteEventGateway (WebSocket-based, to be implemented)
 * 
 * Note: The actual gateway instance is set dynamically after game setup,
 * because LocalEventGateway requires a Game instance. This provider
 * sets up the token; the GameInitializerService populates it.
 */
export function provideEventGateway(gateway: EventGateway): Provider {
  return {
    provide: EVENT_GATEWAY_TOKEN,
    useValue: gateway,
  };
}
