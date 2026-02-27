// Re-export from original source to avoid duplicate type definitions
export {
  TradeState,
  TradeType,
  TradeOffer,
  BankTrade,
  PlayerTrade,
  TradeRequest,
} from '../../../../../src/app/domain/trade/domain/models/trade.model';
export type {
  TradeEvents,
  TradeResponse,
  TradeComplete,
  TradeCancel,
} from '../../../../../src/app/domain/trade/domain/models/trade.model';
