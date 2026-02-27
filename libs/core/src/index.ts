// @catan/core — Public API

// Environment
export { environment, Edition } from './lib/environment/environment';
export type { EnvironmentConfig } from './lib/environment/environment';

// Tokens
export {
  DEV_TOKEN,
  EDITION_TOKEN,
  VERSION_TOKEN,
  EVENT_GATEWAY_TOKEN,
  provideDevToken,
  provideEditionToken,
  provideVersionToken,
} from './lib/tokens/tokens';

// State (Signal Stores)
export { UserStore } from './lib/state/user.store';
export { LobbyStore } from './lib/state/lobby.store';

// Guards
export { canActivateGame } from './lib/guards/game-map.guard';
