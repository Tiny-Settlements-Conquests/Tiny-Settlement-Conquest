import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GameMode } from '../../../game/domain/models/game-mode.model';
import { GameModeRepository } from '../../../game/domain/state/game-mode.repository';
import { InventoryRepository } from '../../../inventory/domain/state/inventory.repository';
import { BlockComponent } from '../../../layouts/ui/block/block.component';
import { TitleComponent } from '../../../layouts/ui/title/title.component';
import { RoundPlayerRepository } from '../../../round/domain/state/round-players.repository';
import { TooltipDirective } from '../../../tooltip/tooltip.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResourceCardComponent } from '../../../resources/ui/resource-card/resource-card.component';
@Component({
  selector: 'app-buildings-selection',
  standalone: true,
  imports: [
    TitleComponent,
    BlockComponent,
    NgClass,
    TooltipDirective,
    MatTooltipModule,
    ResourceCardComponent
  ],

  templateUrl: './buildings-selection.component.html',
  styleUrl: './buildings-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingsSelectionComponent {
  private readonly _gameModeRepository = inject(GameModeRepository);
  private readonly _inventoryRepository = inject(InventoryRepository);
  private readonly _roundRepository = inject(RoundPlayerRepository);

  public activeMode = toSignal(
    this._gameModeRepository.selectMode()
  );

  public inventory = toSignal(
    this._inventoryRepository.selectInventory()
  );

  public readonly isMyTurn = toSignal(
    this._roundRepository.selectIsMyTurn()
  )

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

