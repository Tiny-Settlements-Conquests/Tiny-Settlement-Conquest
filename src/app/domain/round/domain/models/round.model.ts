import { EventQueueItem, GatewayEventsParamsMap } from "../../../event-queues/domain/models/event-queue.model";
import { QueueItem, isTypeofEvent } from "../../../event-queues/domain/models/queue.model";
import { Player } from "../../../player/domain/classes/player";

export type NextRoundEvents = 'nextRound';

export type NextRoundEventsParamsMap = {
    'nextRound': null
}

export function isNextRoundEvent(event: EventQueueItem): event is QueueItem<GatewayEventsParamsMap, 'nextRound'> {
  return isTypeofEvent<GatewayEventsParamsMap>('nextRound', event)
}


export interface RoundInformation {
    roundNumber: number;
    activePlayer: Player;
}