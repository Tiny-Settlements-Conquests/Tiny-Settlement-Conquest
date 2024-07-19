import { createAction, props } from '@ngneat/effects';
import { OpenTradeOfferLocal } from '../models/trade.model';

export class TradeActions {
    public static readonly addTrade = createAction('[tradeActions Store] add trade', props<OpenTradeOfferLocal>());
    public static readonly removeTrade = createAction('[tradeActions Store] remove trade', props<{id: OpenTradeOfferLocal['id']}>());
}