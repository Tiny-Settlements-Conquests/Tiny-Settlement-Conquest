import { inject, Injectable } from '@angular/core';
import { EventGateway } from '../domain/models/event-gateway.model';
import { EventQueueItem } from '../domain/models/event-queue.model';
import { BaseEventGateway } from './base-event-gateway';
import { isTradeOfferAcceptEvent, isTradeOfferDenyEvent, isTradeOfferOpenEvent } from '../../trade/domain/models/trade.model';
import { isBuildBuildingEvent, isBuildRoadEvent } from '../../buildings/domain/models/building.model';
import { isNextRoundEvent } from '../../round/domain/models/round.model';
import { GameSetupService } from '../../game/domain/services/game-setup.service';
import { isRollDicesEvent } from '../../dice/domain/models/dice.model';

@Injectable({
  providedIn: 'any'
})
export class EventGatewayService extends BaseEventGateway {
  private readonly gameService = inject(GameSetupService)

  public handle(event: EventQueueItem | undefined): void {
    console.log("EVENT GATEWAY SERVICE  ", event)
    if(typeof event === 'undefined') return;
    const game = this.gameService.game
    if(!game) return;

    if(isTradeOfferOpenEvent(event)) {
      game.getTradeManager().startTrade(event.data);
    } else if(isTradeOfferAcceptEvent(event)) {
      game.getTradeManager().respondToTrade(event.data)
    } else if(isTradeOfferDenyEvent(event)) {
      game.getTradeManager().respondToTrade(event.data)
    } else if(isBuildBuildingEvent(event)) {
      game.tryBuildBuildingOnGraphNode(event.data.node, event.data.type);
    } else if(isBuildRoadEvent(event)) {
      game.tryBuildRoadBetweenGraphNodes(event.data.from, event.data.to);
    } else if(isNextRoundEvent(event)) {
      game.nextRound();
    } else if(isRollDicesEvent(event)) {
      game.rollDice();
    }
  }

}
