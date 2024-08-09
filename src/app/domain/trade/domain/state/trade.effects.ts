import { Injectable, inject } from '@angular/core';
import { createEffect, ofType } from '@ngneat/effects';
import { tap } from 'rxjs';
import { TradeRepository } from './trade.repository';
import { TradeActions } from './trade.actions';
import { GATEWAY_TOKEN } from '../../../gateway/domain/token/gateway.token';

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
                this._gateway.publish('trade-offer', trade);
                // this._tradeRepository.addTrade(trade);
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
    
}