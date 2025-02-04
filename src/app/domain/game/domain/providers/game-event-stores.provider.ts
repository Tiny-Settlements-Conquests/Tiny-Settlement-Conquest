import { Provider } from "@angular/core";
import { InventoryStore } from "../../../inventory/domain/state/inventory.store";
import { DiceStore } from "../../../dice/domain/state/dice.store";
import { RoundPlayerStore } from "../../../round/domain/state/round-player.store";

export function provideGameEventStores(): Provider[] {
    return [
      InventoryStore,
      DiceStore,
      RoundPlayerStore,
    ]
}