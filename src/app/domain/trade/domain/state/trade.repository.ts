import { createStore } from "@ngneat/elf";
import { deleteEntities, selectAllEntities, setEntities, updateEntities, upsertEntities, withEntities } from "@ngneat/elf-entities";
import { OpenTradeOffer, TradeOffer, TradeResponse } from "../models/trade.model";
import { Injectable } from "@angular/core";

const tradeStore = createStore(
    { name: 'trades' },
    withEntities<OpenTradeOffer>()
);

@Injectable(
    { providedIn: 'root' }
  )
export class TradeRepository {
    public addTrade(trade: OpenTradeOffer) {
        tradeStore.update(setEntities([trade]));
    }

    public removeTrade(tradeId: OpenTradeOffer['id']) {
        tradeStore.update(deleteEntities([tradeId]));
    }

    public selectNewTrades() {
        
    }

    public selectAllTrades() {
        return tradeStore.pipe(
            selectAllEntities()
        )
    }

    public updateTrade(trade: OpenTradeOffer) {
        tradeStore.update(upsertEntities([trade]));
    }

    public addPlayerResponse(trade: TradeResponse) {
        tradeStore.update(
            updateEntities( trade.tradeId, ((e) => {
                const response = e.playerResponses;
                if(!response[trade.respondedPlayer.id]) {
                    // dont allow updates
                    response[trade.respondedPlayer.id] = trade
                }
                return {
                    ...e,
                    playerResponses: response
                };
            }))
        )
    }
}
