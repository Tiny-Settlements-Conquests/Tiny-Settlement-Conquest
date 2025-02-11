import { inject } from "@angular/core";
import { EventGateway } from "./event-gateway.model";
import { Game } from "../game/domain/classes/game";
import { BuildingType } from "../buildings/domain/models/building.model";
import { GraphNode } from "../graph/domain/classes/graph-node";
import { TradeRequest, TradeResponse } from "../trade/domain/models/trade.model";


export class LocalEventGateway implements EventGateway {
    constructor(private readonly game: Game) {}

    rollDice(): void {
        this.game.rollDice();
    }
    nextRound(): void {
        this.game.nextRound();
    }
    tryBuildRoadBetweenGraphNodes(nodeA: GraphNode, nodeB: GraphNode): void {
        this.game.tryBuildRoadBetweenGraphNodes(nodeA, nodeB);
    }
    tryBuildBuildingOnGraphNode(node: GraphNode, typ: BuildingType): void {
        this.game.tryBuildBuildingOnGraphNode(node, typ);
    }
    respondToTrade(trade: TradeResponse): void {
        this.game.getTradeManager().respondToTrade(trade);
    }
    startTrade(trade: TradeRequest): void {
        this.game.getTradeManager().startTrade({
            ...trade
        });
    }
}