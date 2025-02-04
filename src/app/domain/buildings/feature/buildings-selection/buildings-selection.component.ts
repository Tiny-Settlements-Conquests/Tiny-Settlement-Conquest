import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GameMode } from '../../../game/domain/models/game-mode.model';
import { GameModeRepository } from '../../../game/domain/state/game-mode.repository';
import { InventoryRepository } from '../../../inventory/domain/state/inventory.repository';
import { ResourceCardComponent } from '../../../resources/ui/resource-card/resource-card.component';
import { RoundPlayerStore } from '../../../round/domain/state/round-player.store';
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
  private readonly _gameModeRepository = inject(GameModeRepository);
  private readonly _inventoryRepository = inject(InventoryRepository);
  private readonly _roundStore = inject(RoundPlayerStore);

  public activeMode = toSignal(
    this._gameModeRepository.selectMode()
  );

  public inventory = toSignal(
    this._inventoryRepository.selectInventory()
  );

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
      this._gameModeRepository.updateMode('spectate');
    } else {
      this._gameModeRepository.updateMode(gameMode);
    }
  }
}

