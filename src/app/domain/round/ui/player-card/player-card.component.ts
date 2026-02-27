import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { ActionCardComponent } from '../../../cards/feature/action-card/action-card.component';
import { RoundPlayer } from '@catan/shared/models';
import { PlayerWinningPointsComponent } from '../player-winning-points/player-winning-points.component';


@Component({
    selector: 'app-player-card',
    imports: [
        ActionCardComponent,
        PlayerWinningPointsComponent,
    ],
    templateUrl: './player-card.component.html',
    styleUrl: './player-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerCardComponent {
  public icons = {
    question: faQuestion
  }

  public readonly player = input.required<RoundPlayer>();
  public readonly winningPoints = input<number>(0);
  public readonly isMe = input(false);
}
