import { Injectable, inject } from '@angular/core';
import { createEffect, ofType } from '@ngneat/effects';
import { tap } from 'rxjs';
import { TradeRepository } from './trade.repository';
import { TradeActions } from './trade.actions';

@Injectable({
    providedIn: 'root'
})
export class TradeEffects {
    private readonly _tradeRepository = inject(TradeRepository);

    public addTrade = createEffect((actions) =>
        actions.pipe(
            ofType(TradeActions.addTrade),
            tap((trade) => {
                this._tradeRepository.addTrade(trade);
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