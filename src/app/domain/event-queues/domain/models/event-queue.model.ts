import { BuildingEvents, BuildingEventsParamsMap } from "../../../buildings/domain/models/building.model";
import { DiceEvents, DiceEventsParamsMap } from "../../../dice/domain/models/dice.model";
import { NextRoundEvents, NextRoundEventsParamsMap } from "../../../round/domain/models/round.model";
import { TradeEvents, TradeEventsParamsMap } from "../../../trade/domain/models/trade.model";
import { QueueItem } from "./queue.model";

export type GatewayEvents = TradeEvents | BuildingEvents | NextRoundEvents | DiceEvents;  //todo hier um neue events erweitern
export type GatewayEventsParamsMap = TradeEventsParamsMap & BuildingEventsParamsMap & NextRoundEventsParamsMap & DiceEventsParamsMap; //todo hier um neue events erweitern

export interface EventQueueItem extends QueueItem<GatewayEventsParamsMap, GatewayEvents> {}

export type EventItem = {
    [K in GatewayEvents]: {
      eventType: K;
      data: GatewayEventsParamsMap[K];
    };
  }[GatewayEvents];