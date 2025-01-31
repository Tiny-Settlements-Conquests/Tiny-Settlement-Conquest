import { inject, Injectable } from '@angular/core';
import { RoundPlayerRepository } from '../../../round/domain/state/round-players.repository';
import { MediumBot } from '../classes/medium-bot';

@Injectable({
  providedIn: 'any'
})
export class BotSyncService {
  private readonly _roundPlayerRepository = inject(RoundPlayerRepository);

  constructor() {
    this.syncBot();
  }

  private syncBot() {
    this._roundPlayerRepository.selectActiveRoundPlayer().subscribe((player) => {
      if(!player) return;
      if(player.isBot) {
        console.log("ITS A BOT!") // TODO ALS INJECTION TOKEN
          // new MediumBot().makeMove(this.game, player)
        }
    })
  }
}
