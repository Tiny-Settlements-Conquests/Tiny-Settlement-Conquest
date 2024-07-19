import { ResourceInventory,  } from "../../../inventory/domain/classes/resource-inventory";
import { Player } from "../../../player/domain/classes/player";
import { Resources } from "../../../resources/domain/models/resources.model";
import { RoundPlayer } from "../../../round/domain/models/round-player.model";


export interface TradeOffer {
  id: string;
  offeredResources: Partial<Resources>;
  requestedResources: Partial<Resources>;
  player: Player;
}


export interface TradeResponse {
  tradeId: string;
  respondedPlayer: Player;
  accepted: boolean;
}

export interface TradeComplete {
  trade: TradeOffer;
  acceptedPlayer: Player;
}

export interface TradeCancel {
  tradeId: string;
}

export interface OpenTradeOffer extends TradeOffer{
  playerResponses: { [playerId: string]: boolean };
}


//todo find a better name, but Player cannot be used here because class player is only available in backend code
export interface OpenTradeOfferLocal {
  id: string;
  offeredResources: Partial<Resources>;
  requestedResources: Partial<Resources>;
  player: RoundPlayer;
  playerResponses: { [playerId: string]: boolean };
}