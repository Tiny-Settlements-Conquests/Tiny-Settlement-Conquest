import { Resources } from "../../../resources/domain/models/resources.model";
import { RoundPlayer } from "../../../round/domain/models/round-player.model";

export enum TradeState {
  Open,
  Accepted,
  Declined,
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

export interface OpenTradeOffer extends PlayerTrade {
  playerResponses: { [playerId: string]: TradeResponse };
}

export type TradeOffer = BankTrade | PlayerTrade;

export interface BankTrade extends TradeInformation {
  typ: 'bank',
}

export interface PlayerTrade extends TradeInformation {
  typ: 'player',

}
