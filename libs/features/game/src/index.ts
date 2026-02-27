// @catan/feature-game — Public API

// Facade
export { GameFacade } from './lib/facades/game.facade';

// State (Signal Stores)
export { InventoryStore } from './lib/state/inventory.store';
export { BankStore } from './lib/state/bank.store';
export { DiceStore } from './lib/state/dice.store';
export { RoundPlayerStore } from './lib/state/round-player.store';
export { RoundCountdownStore } from './lib/state/round-countdown.store';
export { GameModeStore } from './lib/state/game-mode.store';
export { GameStateStore } from './lib/state/game-state.store';
export { ActionHistoryStore } from './lib/state/action-history.store';
export { withResourceInventory } from './lib/state/with-resource-inventory.feature';

// Services
export { GameEventDispatcherService } from './lib/services/game-event-dispatcher.service';
export { GameInitializerService } from './lib/services/game-initializer.service';
export { BotSyncService } from './lib/services/bot-sync.service';

// Providers
export { provideGameStores } from './lib/providers/game-stores.provider';
export { provideEventGateway } from './lib/providers/event-gateway.provider';
export { provideGameClientServices } from './lib/providers/game-client.provider';
