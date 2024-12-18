import { BuildingEvents, BuildingEventsParamsMap } from "../../../buildings/domain/models/building.model";
import { NextRoundEvents, NextRoundEventsParamsMap } from "../../../round/domain/models/round.model";
import { TradeEvents, TradeEventsParamsMap } from "../../../trade/domain/models/trade.model";

export type GatewayEvents = TradeEvents | BuildingEvents | NextRoundEvents;  //todo hier um neue events erweitern
export type GatewayEventsParamsMap = TradeEventsParamsMap & BuildingEventsParamsMap & NextRoundEventsParamsMap; //todo hier um neue events erweitern

export interface ResponseQueueItem {
    id: string;
    type: GatewayEvents;
    data: any;
}

export type EventItem = {
    [K in GatewayEvents]: {
      eventType: K;
      data: GatewayEventsParamsMap[K];
    };
  }[GatewayEvents];