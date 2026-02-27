import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GameMode } from '@catan/shared/models';
import { GameFacade } from '@catan/feature-game';
import { ResourceCardComponent } from '../../../resources/ui/resource-card/resource-card.component';
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
  private readonly _facade = inject(GameFacade);

  public activeMode = this._facade.gameMode;

  public inventory = this._facade.inventory;

  public readonly isMyTurn = this._facade.isMyTurn;

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
      this._facade.setGameMode('spectate');
    } else {
      this._facade.setGameMode(gameMode);
    }
  }
}

