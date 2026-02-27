import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GameFacade } from '@catan/feature-game';
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
  private readonly _facade = inject(GameFacade);
  
  public readonly players = this._facade.roundPlayers;

  public readonly activePlayer = this._facade.activePlayer;

  public readonly me = this._facade.me;

  public readonly dices = this._facade.dices;
}
