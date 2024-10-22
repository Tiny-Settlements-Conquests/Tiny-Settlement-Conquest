import { ResourceInventory,  } from "../../../inventory/domain/classes/resource-inventory";
import { Player } from "../../../player/domain/classes/player";
import { Resources } from "../../../resources/domain/models/resources.model";
import { RoundPlayer } from "../../../round/domain/models/round-player.model";


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
  trade: TradeInformation;
  acceptedPlayer: RoundPlayer;
}

export interface TradeCancel {
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
