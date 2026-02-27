import { effect, inject, Injectable } from '@angular/core';
import { EVENT_GATEWAY_TOKEN } from '@catan/core';
import { RoundPlayerStore } from '../state/round-player.store';
import { MediumBot } from '@catan/game-engine';
import { Game } from '@catan/game-engine';

/**
 * BotSyncService — Triggers bot AI moves when it's a bot's turn.
 * 
 * Watches the active player signal and delegates to bot AI when active player is a bot.
 * TODO: Refactor MediumBot.makeMove() to use EventGateway instead of direct Game access.
 * This is necessary for multiplayer mode where bots would run server-side.
 */
@Injectable()
export class BotSyncService {
  private readonly roundPlayerStore = inject(RoundPlayerStore);
  private readonly gateway = inject(EVENT_GATEWAY_TOKEN);

  private game: Game | undefined;

  /** Set the game reference — needed until bot is fully gateway-based */
  setGame(game: Game): void {
    this.game = game;
  }

  constructor() {
    effect(() => {
      const player = this.roundPlayerStore.activeRoundPlayer();
      if (player?.isBot && this.game) {
        new MediumBot().makeMove(this.game, player);
      }
    });
  }
}
