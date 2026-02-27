import { Provider } from '@angular/core';
import { InventoryStore } from '../state/inventory.store';
import { BankStore } from '../state/bank.store';
import { DiceStore } from '../state/dice.store';
import { RoundPlayerStore } from '../state/round-player.store';
import { RoundCountdownStore } from '../state/round-countdown.store';
import { GameModeStore } from '../state/game-mode.store';
import { GameStateStore } from '../state/game-state.store';
import { ActionHistoryStore } from '../state/action-history.store';

/**
 * Provides all game-related Signal Stores at the component level.
 * These stores are scoped to the GameComponent — they are created when
 * the game starts and destroyed when the user navigates away.
 */
export function provideGameStores(): Provider[] {
  return [
    InventoryStore,
    BankStore,
    DiceStore,
    RoundPlayerStore,
    RoundCountdownStore,
    GameModeStore,
    GameStateStore,
    ActionHistoryStore,
  ];
}
