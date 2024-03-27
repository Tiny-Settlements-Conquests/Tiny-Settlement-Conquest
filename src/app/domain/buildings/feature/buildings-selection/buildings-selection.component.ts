import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TitleComponent } from '../../../layouts/ui/title/title.component';
import { BlockComponent } from '../../../layouts/ui/block/block.component';
import { GameModeRepository } from '../../../game/domain/state/game-mode.repository';
import { GameMode } from '../../../game/domain/models/game-mode.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-buildings-selection',
  standalone: true,
  imports: [
    TitleComponent,
    BlockComponent,
    NgClass
  ],
  templateUrl: './buildings-selection.component.html',
  styleUrl: './buildings-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingsSelectionComponent { 
  private readonly _gameModeRepository = inject(GameModeRepository);

  public activeMode = toSignal(
    this._gameModeRepository.selectMode()
  )

  public updateGameMode(gameMode: GameMode): void {
    if(this.activeMode() === gameMode) {
      this._gameModeRepository.updateMode('spectate')
    } else {
      this._gameModeRepository.updateMode(gameMode);
    }
  }
}
