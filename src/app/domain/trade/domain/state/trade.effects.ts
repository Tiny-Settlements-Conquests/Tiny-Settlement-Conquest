import { Injectable, inject } from '@angular/core';
import { createEffect, ofType } from '@ngneat/effects';
import { tap } from 'rxjs';
import { TradeRepository } from './trade.repository';
import { TradeActions } from './trade.actions';
import { GATEWAY_TOKEN } from '../../../gateway/domain/token/gateway.token';
import { TradeType } from '../models/trade.model';

@Injectable({
    providedIn: 'root'
})
export class TradeEffects {
    private readonly _tradeRepository = inject(TradeRepository);
    private readonly _gateway = inject(GATEWAY_TOKEN);

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
                //todo umbauen 
                this._gateway.publish('trade-offer-accept', trade)
                this._tradeRepository.addPlayerResponse(trade)
            })
        )
    )

    public denyTrade = createEffect((actions) =>
        actions.pipe(
            ofType(TradeActions.denyTrade),
            tap((trade) => {
                this._gateway.publish('trade-offer-deny', trade)
                this._tradeRepository.addPlayerResponse(trade)
            })
        )
    )
    
}