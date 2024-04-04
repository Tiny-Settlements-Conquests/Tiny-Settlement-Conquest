import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faForward } from '@fortawesome/free-solid-svg-icons';
import { RoundPlayerRepository } from '../../domain/state/round-players.repository';
import { GameComponent } from '../../../../pages/game';

@Component({
  selector: 'app-next-move-button',
  standalone: true,
  imports: [
    FontAwesomeModule,
  ],
  templateUrl: './next-move-button.component.html',
  styleUrl: './next-move-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextMoveButtonComponent { 
  public readonly gameComponent = inject(GameComponent);
  
  public icons = {
    next: faForward
  }

  @HostListener('click')
  public endMove() {
    // todo hier muss noch ne abstraktion rein da sonst nur lokale matches funktionieren würden!
    this.gameComponent.game?.nextRound();
  }
}
