import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faForward } from '@fortawesome/free-solid-svg-icons';
import { RoundPlayerRepository } from '../../domain/state/round-players.repository';

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
  public readonly roundPlayerRepository = inject(RoundPlayerRepository);
  
  public icons = {
    next: faForward
  }

  @HostListener('click')
  public endMove() {
    this.roundPlayerRepository.nextRoundPlayer()
  }
}
