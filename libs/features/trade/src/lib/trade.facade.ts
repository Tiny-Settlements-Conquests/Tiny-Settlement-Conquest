import { inject, Injectable } from '@angular/core';
import { EVENT_GATEWAY_TOKEN } from '@catan/core';
import { TradeResponse, TradeType } from '@catan/shared/models';
import { RoundPlayerStore } from '@catan/feature-game';
// Import from original source to ensure token identity (single signalStore instance)
import { TradeStore } from '../../../../../src/app/domain/trade/domain/state/trade.store';

export { TradeStore };

/**
 * TradeFacade — Encapsulates trade state and actions.
 * Components inject this instead of individual trade stores/services.
 */
@Injectable()
export class TradeFacade {
  private readonly gateway = inject(EVENT_GATEWAY_TOKEN);
  private readonly tradeStore = inject(TradeStore);
  private readonly roundPlayerStore = inject(RoundPlayerStore);

  /** Active trade entities */
  readonly trades = this.tradeStore.entities;

  /** Start a new trade through the gateway */
  startTrade(offeredResources: Record<string, number>, requestedResources: Record<string, number>, isPlayerTrade: boolean): void {
    const me = this.roundPlayerStore.me();
    if (!me) return;

    this.gateway.startTrade({
      typ: isPlayerTrade ? TradeType.Player : TradeType.Bank,
      player: me,
      offeredResources,
      requestedResources,
    });
  }

  /** Respond to an active trade */
  respondToTrade(response: TradeResponse): void {
    this.gateway.respondToTrade(response);
  }
}
