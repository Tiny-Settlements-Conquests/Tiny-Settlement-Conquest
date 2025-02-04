import { effect, inject, Injectable } from '@angular/core';
import { GameSetupService } from '../../../game/domain/services/game-setup.service';
import { RoundPlayerStore } from '../../../round/domain/state/round-player.store';
import { MediumBot } from '../classes/medium-bot';

@Injectable({
  providedIn: 'any'
})
export class BotSyncService {
  private readonly _roundPlayerStore= inject(RoundPlayerStore);
  private readonly _gameSetupService = inject(GameSetupService);

  constructor() {
    effect(() => {
      const player = this._roundPlayerStore.activeRoundPlayer();
      if(player?.isBot) {
        const game = this._gameSetupService.game;
        if(!game) throw new Error(`Invalid game`);
        new MediumBot().makeMove(game, player)
        
      }
    })
  }

}
