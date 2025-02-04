import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GameMode } from '../../../game/domain/models/game-mode.model';
import { ResourceCardComponent } from '../../../resources/ui/resource-card/resource-card.component';
import { RoundPlayerStore } from '../../../round/domain/state/round-player.store';
import { InventoryStore } from '../../../inventory/domain/state/inventory.store';
import { GameModeStore } from '../../../game/domain/state/game-mode.store';
@Component({
    selector: 'app-buildings-selection',
    imports: [
        NgClass,
        MatTooltipModule,
        ResourceCardComponent
    ],
    templateUrl: './buildings-selection.component.html',
    styleUrl: './buildings-selection.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildingsSelectionComponent {
  private readonly _gameModeStore= inject(GameModeStore);
  private readonly _inventoryStore = inject(InventoryStore);
  private readonly _roundStore = inject(RoundPlayerStore);

  public activeMode = this._gameModeStore.mode

  public inventory = this._inventoryStore.resources

  public readonly isMyTurn = this._roundStore.isMyTurn;

  public readonly activateRoad = computed(() => {
    const inventory = this.inventory();
    if(!inventory) {
      return false;
    }
    return inventory.bricks > 0 && inventory.wood > 0 && this.isMyTurn();
  });

  public readonly activateTown = computed(() => {
    const inventory = this.inventory();
    if(!inventory) {
      return false;
    }

    return inventory.bricks > 0 && inventory.wood > 0 && inventory.straw > 0 && inventory.wool > 0 && this.isMyTurn();
  })

  public readonly activateCity = computed(() => {
    const inventory = this.inventory();
    if(!inventory) {
      return false;
    }

    return inventory.stone > 2 && inventory.straw > 1 && this.isMyTurn();
  })

  public updateGameMode(gameMode: GameMode): void {
    const activeMode = this.activeMode();
    if (activeMode === gameMode) {
      this._gameModeStore.setMode('spectate');
    } else {
      this._gameModeStore.setMode(gameMode);
    }
  }
}

