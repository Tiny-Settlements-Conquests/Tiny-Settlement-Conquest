import { createStore } from "@ngneat/elf";
import { deleteEntities, selectAllEntities, setEntities, updateEntities, upsertEntities, withEntities } from "@ngneat/elf-entities";
import { OpenTradeOffer, OpenTradeOfferLocal, TradeOffer } from "../models/trade.model";
import { Injectable } from "@angular/core";

const tradeStore = createStore(
    { name: 'trades' },
    withEntities<OpenTradeOfferLocal>()
);

@Injectable(
    { providedIn: 'root' }
  )
export class TradeRepository {
    public addTrade(trade: OpenTradeOfferLocal) {
        tradeStore.update(setEntities([trade]));
    }

    public removeTrade(tradeId: OpenTradeOfferLocal['id']) {
        tradeStore.update(deleteEntities([tradeId]));
    }

    public selectNewTrades() {
        
    }

    public selectAllTrades() {
        return tradeStore.pipe(
            selectAllEntities()
        )
    }

    public updateTrade(trade: OpenTradeOfferLocal) {
        tradeStore.update(upsertEntities([trade]));
    }
}
