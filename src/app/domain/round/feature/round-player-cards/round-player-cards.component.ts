import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DiceRandomNumberComponent } from '../../../dice/ui/dice-random-number/dice-random-number.component';
import { PlayerCardComponent } from '../../../player/feature/players-card/player-card.component';
import { UserRepository } from '../../../user/domain/state/user.repository';
import { RoundPlayerRepository } from '../../domain/state/round-players.repository';
import { Round } from '../../domain/classes/round';

@Component({
  selector: 'app-round-player-cards',
  standalone: true,
  imports: [
    PlayerCardComponent,
    NgClass,
    DiceRandomNumberComponent
  ],
  templateUrl: './round-player-cards.component.html',
  styleUrl: './round-player-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundPlayerCardsComponent { 
  private readonly _roundPlayerRepository = inject(RoundPlayerRepository);
  private readonly _userRepository = inject(UserRepository);
  
  public readonly players = toSignal(
    this._roundPlayerRepository.selectRoundPlayers()
  );

  public readonly activePlayer = toSignal(
    this._roundPlayerRepository.selectActiveRoundPlayer()
  );

  public readonly me = toSignal(
    this._userRepository.selectUser()
  )
}
