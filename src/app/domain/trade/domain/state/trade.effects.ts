import { Injectable, inject } from '@angular/core';
import { createEffect, dispatch, ofType } from '@ngneat/effects';
import { tap } from 'rxjs';
import { TradeState, TradeType } from '../models/trade.model';
import { TradeActions } from './trade.actions';
import { TradeRepository } from './trade.repository';
import { EventQueueActions } from './../../../event-queues/domain/state/event-queue/event-queue.actions'

@Injectable({
    providedIn: 'root'
})
export class TradeEffects {
    private readonly _tradeRepository = inject(TradeRepository);

    public addTrade = createEffect((actions) =>
        actions.pipe(
            ofType(TradeActions.addTrade),
            tap((trade) => {
                this._tradeRepository.addTrade({
                    ...trade,
                    typ: TradeType.Player,
                    playerResponses: {},
                    
                });
            })
        )
    )
    
    public removeTrade = createEffect((actions) =>
        actions.pipe(
            ofType(TradeActions.removeTrade),
            tap(({id}) => {
                this._tradeRepository.removeTrade(id);
            })
        )
    )

    public acceptTrade = createEffect((actions) =>
        actions.pipe(
            ofType(TradeActions.acceptTrade),
            tap((trade) => {
                dispatch(
                    EventQueueActions.publish({
                        eventType: 'trade-offer-accept', 
                        data: trade,
                    })
                )
                this._tradeRepository.addPlayerResponse(trade)
            })
        )
    )

    public denyTrade = createEffect((actions) =>
        actions.pipe(
            ofType(TradeActions.denyTrade),
            tap((trade) => {
                const tradeEvent = {
                    ...trade,
                    state: TradeState.Declined,
                    tradeId: trade.tradeId,
                }
                dispatch(
                    EventQueueActions.publish({
                        eventType: 'trade-offer-deny', 
                        data: tradeEvent,
                    })
                )
                this._tradeRepository.addPlayerResponse(trade)
            })
        )
    )
    
}