import { BuildingType } from "../buildings/domain/models/building.model";
import { GraphNode } from "../graph/domain/classes/graph-node";
import { TradeRequest, TradeResponse } from "../trade/domain/models/trade.model";

export interface EventGateway {
    rollDice(): void;
    nextRound(): void;
    tryBuildRoadBetweenGraphNodes(nodeA: GraphNode, nodeB: GraphNode): void;
    tryBuildBuildingOnGraphNode(node: GraphNode, typ: BuildingType): void;
    respondToTrade(trade: TradeResponse): void;
    startTrade(trade: TradeRequest): void;
}