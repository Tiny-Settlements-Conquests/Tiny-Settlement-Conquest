import { effect, inject, Injectable } from '@angular/core';
import { GameInitializerService } from '../../../game/domain/services/game-initializer.service';
import { RoundPlayerStore } from '../../../round/domain/state/round-player.store';
import { MediumBot } from '@catan/game-engine';

@Injectable()
export class BotSyncService {
  private readonly _roundPlayerStore= inject(RoundPlayerStore);
  private readonly _initializer = inject(GameInitializerService);

  constructor() {
    effect(() => {
      const player = this._roundPlayerStore.activeRoundPlayer();
      if(player?.isBot) {
        const game = this._initializer.game;
        if(!game) throw new Error(`Invalid game`);
        // setTimeout(() => {
          new MediumBot().makeMove(game, player)
        // }, 1000);
        
      }
    })
  }

}
