import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faForward } from '@fortawesome/free-solid-svg-icons';
import { GameSetupService } from '../../../game/domain/services/game-setup.service';

@Component({
    selector: 'app-next-move-button',
    imports: [
        FontAwesomeModule,
    ],
    templateUrl: './next-move-button.component.html',
    styleUrl: './next-move-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NextMoveButtonComponent {
  private readonly setupService = inject(GameSetupService);
  public icons = {
    next: faForward
  }

  @HostListener('click')
  public endMove() {
    this.setupService.eventGateway?.nextRound();
  }
}
