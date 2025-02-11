import { Resources } from "../../../resources/domain/models/resources.model";
import { RoundPlayer } from "../../../round/domain/models/round-player.model";

export type TradeEvents = 'trade-offer-open' | 'trade-offer-accept' | 'trade-offer-deny'

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
