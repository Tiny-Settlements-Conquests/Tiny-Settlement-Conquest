import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DiceStore } from '../../../dice/domain/state/dice.store';
import { UserRepository } from '../../../user/domain/state/user.repository';
import { RoundPlayerStore } from '../../domain/state/round-player.store';
import { PlayerCardComponent } from '../../ui/player-card/player-card.component';

@Component({
    selector: 'app-round-player-cards',
    imports: [
        PlayerCardComponent,
        NgClass,
    ],
    templateUrl: './round-player-cards.component.html',
    styleUrl: './round-player-cards.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundPlayerCardsComponent { 
  private readonly _roundPlayerStore= inject(RoundPlayerStore);
  private readonly _diceStore = inject(DiceStore);
  
  public readonly players = this._roundPlayerStore.entities

  public readonly activePlayer = this._roundPlayerStore.activeRoundPlayer

  public readonly me = this._roundPlayerStore.me

  public readonly dices = this._diceStore.dices
}
