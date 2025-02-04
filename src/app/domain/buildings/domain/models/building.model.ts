import { EventQueueItem, GatewayEventsParamsMap } from "../../../event-queues/domain/models/event-queue.model";
import { QueueItem, isTypeofEvent } from "../../../event-queues/domain/models/queue.model";
import { GraphNode } from "../../../graph/domain/classes/graph-node";
import { Player } from "../../../player/domain/classes/player";

export type BuildingEvents = 'buildBuilding' | 'buildRoad';

export type BuildingEventsParamsMap = {
    'buildBuilding': {node: GraphNode, type: BuildingType},
    'buildRoad': {from: GraphNode, to:GraphNode}
}

export function isBuildBuildingEvent(event: EventQueueItem): event is QueueItem<GatewayEventsParamsMap, 'buildBuilding'> {
  return isTypeofEvent<GatewayEventsParamsMap>('buildBuilding', event)
}
export function isBuildRoadEvent(event: EventQueueItem): event is QueueItem<GatewayEventsParamsMap, 'buildRoad'> {
  return isTypeofEvent<GatewayEventsParamsMap>('buildRoad', event)
}



export enum BuildingType {
    TOWN = 'town',
    CITY = 'city',
}

export enum PathType {
    ROAD = 'road',
    SEA_PATH ='seaPath'
}

export type PlaceableType = BuildingType | PathType;

export interface Buildable {
    type: BuildingType | PathType;
    owner: Player,
}
export interface Building extends Buildable {
    type: BuildingType;
    winningPoints: number;
    graphNode: GraphNode
}


export interface PathBuilding extends Buildable {
    type: PathType;
    graphNodeA: GraphNode;
    graphNodeB: GraphNode
}
