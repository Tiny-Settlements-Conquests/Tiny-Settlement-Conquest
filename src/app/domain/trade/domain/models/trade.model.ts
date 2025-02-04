import { EventQueueItem, GatewayEventsParamsMap } from "../../../event-queues/domain/models/event-queue.model";
import { isTypeofEvent, QueueItem } from "../../../event-queues/domain/models/queue.model";
import { Resources } from "../../../resources/domain/models/resources.model";
import { RoundPlayer } from "../../../round/domain/models/round-player.model";

export type TradeEvents = 'trade-offer-open' | 'trade-offer-accept' | 'trade-offer-deny'

export type TradeEventsParamsMap = {
  'trade-offer-open': TradeRequest,
  'trade-offer-accept': TradeResponse,
  'trade-offer-deny': TradeResponse,
}

export function isTradeOfferOpenEvent(event: EventQueueItem): event is QueueItem<GatewayEventsParamsMap, 'trade-offer-open'> {
  return isTypeofEvent<GatewayEventsParamsMap>('trade-offer-open', event)
}
export function isTradeOfferAcceptEvent(event: EventQueueItem): event is QueueItem<GatewayEventsParamsMap, 'trade-offer-accept'> {
  return isTypeofEvent<GatewayEventsParamsMap>('trade-offer-accept', event)
}

export function isTradeOfferDenyEvent(event: EventQueueItem): event is QueueItem<GatewayEventsParamsMap, 'trade-offer-deny'> {
  return isTypeofEvent<GatewayEventsParamsMap>('trade-offer-deny', event)
}

export enum TradeState {
  Open,
  Accepted,
  Declined,
}

export enum TradeType {
  Bank,
  Player,
}

interface TradeInformation {
  id: string;
  player: RoundPlayer;
  offeredResources: Partial<Resources>;
  requestedResources: Partial<Resources>;
}


export interface TradeResponse {
  tradeId: string;
  respondedPlayer: RoundPlayer;
  accepted: boolean;
}

export interface TradeComplete {
  tradeId: string;
  trade: TradeInformation;
  state: TradeState,
  acceptedPlayer: RoundPlayer;
}

export interface TradeCancel {
  state: TradeState,
  tradeId: string;
}

export type TradeOffer = BankTrade | PlayerTrade;

export interface BankTrade extends TradeInformation {
  typ: TradeType.Bank,
}

export interface PlayerTrade extends TradeInformation {
  typ: TradeType.Player,
  playerResponses: { [playerId: string]: TradeResponse };
}

export interface TradeRequest {
  typ: TradeType,
  player: RoundPlayer;
  offeredResources: Partial<Resources>;
  requestedResources: Partial<Resources>;
}
