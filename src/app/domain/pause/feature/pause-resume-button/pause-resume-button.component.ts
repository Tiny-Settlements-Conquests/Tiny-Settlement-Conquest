import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { GAME_STATE } from '@catan/shared/models';
import { MatTooltip } from '@angular/material/tooltip';
import { GameFacade } from '@catan/feature-game';

@Component({
  selector: 'app-pause-resume-button',
  imports: [
    FaIconComponent,
    MatTooltip,
  ],
  templateUrl: './pause-resume-button.component.html',
  styleUrl: './pause-resume-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PauseResumeButtonComponent {
  private readonly _facade = inject(GameFacade);

  public readonly icons = {
    pause: faPause,
    play: faPlay
  }

  public readonly isPaused = computed(() => this._facade.gameState() === GAME_STATE.PAUSE);

  public togglePause() {
    if(this.isPaused()) {
      this._facade.resume();
    } else {
      this._facade.pause();
    }
  }
}
