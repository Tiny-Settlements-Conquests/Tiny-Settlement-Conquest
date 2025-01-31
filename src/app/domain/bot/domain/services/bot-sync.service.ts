import { inject, Injectable } from '@angular/core';
import { RoundPlayerRepository } from '../../../round/domain/state/round-players.repository';
import { MediumBot } from '../classes/medium-bot';
import { GameSetupService } from '../../../game/domain/services/game-setup.service';

@Injectable({
  providedIn: 'any'
})
export class BotSyncService {
  private readonly _roundPlayerRepository = inject(RoundPlayerRepository);
  private readonly _gameSetupService = inject(GameSetupService);

  constructor() {
    this.syncBot();
  }

  private syncBot() {
    this._roundPlayerRepository.selectActiveRoundPlayer().subscribe((player) => {
      if(!player) return;
      if(player.isBot) {
        const game = this._gameSetupService.game;
        if(!game) throw new Error(`Invalid game`);
          new MediumBot().makeMove(game, player)
        }
    })
  }
}
