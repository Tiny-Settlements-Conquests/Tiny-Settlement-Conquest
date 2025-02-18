import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { GameStateStore } from '../../../game/domain/state/game-state.store';
import { GAME_STATE } from '../../../game/domain/models/game-state.model';
import { MatTooltip } from '@angular/material/tooltip';
import { GameSetupService } from '../../../game/domain/services/game-setup.service';

@Component({
  selector: 'app-pause-resume-button',
  imports: [
    FaIconComponent,
    MatTooltip
  ],
  templateUrl: './pause-resume-button.component.html',
  styleUrl: './pause-resume-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PauseResumeButtonComponent {
  private readonly _gameStateStore = inject(GameStateStore);
  private readonly setupService = inject(GameSetupService);

  public readonly icons = {
    pause: faPause,
    play: faPlay
  }

  private readonly state = this._gameStateStore.state;

  public readonly isPaused = computed(() => this.state() === GAME_STATE.PAUSE);

  public togglePause() {
    // todo this should be updated via game sync and not manually
    if(this.isPaused()) {
      this.setupService.eventGateway?.resume();
    } else {
      this.setupService.eventGateway?.pause();
    }
    this._gameStateStore.setMode(this.isPaused() ? GAME_STATE.PLAY : GAME_STATE.PAUSE);
  }
}
