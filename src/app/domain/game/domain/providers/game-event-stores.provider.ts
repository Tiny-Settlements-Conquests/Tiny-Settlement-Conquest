import { Provider } from "@angular/core";
import { InventoryStore } from "../../../inventory/domain/state/inventory.store";
import { DiceStore } from "../../../dice/domain/state/dice.store";
import { RoundPlayerStore } from "../../../round/domain/state/round-player.store";
import { GameModeStore } from "../state/game-mode.store";
import { BankStore } from "../../../bank/domain/state/bank.store";
import { TradeStore } from "../../../trade/domain/state/trade.store";
import { RoundCountdownStore } from "../../../round/domain/state/countdown/round-countdown.store";
import { ActionHistoryStore } from "../../../action-history/domain/state/action-history.store";
import { GameStateStore } from "../state/game-state.store";

export function provideGameEventStores(): Provider[] {
    return [
      InventoryStore,
      DiceStore,
      RoundPlayerStore,
      GameModeStore,
      BankStore,
      TradeStore,
      RoundCountdownStore,
      ActionHistoryStore,
      GameStateStore
    ]
}