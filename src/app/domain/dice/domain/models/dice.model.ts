import { EventQueueItem, GatewayEventsParamsMap } from "../../../event-queues/domain/models/event-queue.model";
import { isTypeofEvent, QueueItem } from "../../../event-queues/domain/models/queue.model";

export type DiceEvents = 'rollDices';

export type DiceEventsParamsMap = {
    'rollDices': null
}

export function isRollDicesEvent(event: EventQueueItem): event is QueueItem<GatewayEventsParamsMap, 'rollDices'> {
  return isTypeofEvent<GatewayEventsParamsMap>('rollDices', event)
}


export type Dices = [number, number]

export interface RolledDices {
    dice1: number,
    dice2: number
    sum: number
}