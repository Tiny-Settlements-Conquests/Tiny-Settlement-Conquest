import { Provider } from '@angular/core';
import { Edition, environment } from '@catan/core';
import { BotSyncService } from '../services/bot-sync.service';

/**
 * Provides edition-specific services for the game.
 * 
 * - SINGLEPLAYER: Enables BotSyncService for AI player turns
 * - MULTIPLAYER: Will provide WebSocket-based services (TODO)
 */
export function provideGameClientServices(): Provider[] {
  const edition = environment.edition;

  if (edition === Edition.SINGLEPLAYER) {
    return [BotSyncService];
  }

  // Multiplayer: no bot services needed (bots run server-side)
  return [];
}
