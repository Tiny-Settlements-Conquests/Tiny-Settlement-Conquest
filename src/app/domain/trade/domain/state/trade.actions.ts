import { createAction, props } from '@ngneat/effects';
import { PlayerTrade, TradeOffer, TradeResponse } from '../models/trade.model';

export class TradeActions {
    public static readonly acceptTrade = createAction('[tradeActions Store] accept Trade', props<TradeResponse>());
    public static readonly denyTrade = createAction('[tradeActions Store] decline trade', props<TradeResponse>());
    public static readonly addTrade = createAction('[tradeActions Store] add trade', props<PlayerTrade>());
    public static readonly removeTrade = createAction('[tradeActions Store] remove trade', props<{id: TradeOffer['id']}>());
}