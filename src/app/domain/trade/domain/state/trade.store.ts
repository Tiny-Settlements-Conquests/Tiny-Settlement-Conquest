import { patchState, signalStore, withMethods } from "@ngrx/signals";
import { addEntity, removeEntity, updateEntity, withEntities } from '@ngrx/signals/entities';
import { PlayerTrade, TradeResponse } from "../models/trade.model";


export const TradeStore = signalStore(
    withEntities<PlayerTrade>(),
    withMethods((store) => ({
        addTrade(trade: PlayerTrade) {
            patchState(store, addEntity(trade));
        },
        removeTrade(tradeId: PlayerTrade['id']) {
            patchState(store, removeEntity(tradeId));
        },
        addPlayerResponse(trade: TradeResponse) {
            patchState(store, updateEntity({
                id: trade.tradeId,
                changes: (entity) => {
                    const response = entity.playerResponses;
                    if(!response[trade.respondedPlayer.id]) {
                        // dont allow updates
                        response[trade.respondedPlayer.id] = trade
                    }
                    return {
                        ...entity,
                        playerResponses: response
                    };
                }
            }));
        }
    }))
);