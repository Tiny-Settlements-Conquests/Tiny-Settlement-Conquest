import { Injectable } from "@angular/core";
import { createStore } from "@ngneat/elf";
import { deleteEntities, selectAllEntities, setEntities, updateEntities, upsertEntities, withEntities } from "@ngneat/elf-entities";
import { PlayerTrade, TradeResponse } from "../models/trade.model";

const tradeStore = createStore(
    { name: 'trades' },
    withEntities<PlayerTrade>()
);

@Injectable(
    { providedIn: 'root' }
  )
export class TradeRepository {
    public addTrade(trade: PlayerTrade) {
        tradeStore.update(upsertEntities([trade]));
    }

    public removeTrade(tradeId: PlayerTrade['id']) {
        tradeStore.update(deleteEntities([tradeId]));
    }

    public selectNewTrades() {
        
    }

    public selectAllTrades() {
        return tradeStore.pipe(
            selectAllEntities()
        )
    }

    public updateTrade(trade: PlayerTrade) {
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
