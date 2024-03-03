import { Graph } from "../../../graph/domain/classes/graph";
import { GraphNode } from "../../../graph/domain/classes/graph-node";
import { Player } from "../../../player/domain/classes/player";
import { Playground } from "../../../playground/domain/classes/playground";
import { GraphBuildingNode } from "../graph/graph-building-node";
import { BuildingType } from "../models/building.model";

export class BuildingBuildManager {
    constructor(
        private readonly buildingGraph: Graph<GraphBuildingNode>,
        private readonly player: Player
    ) {}

    public tryBuildBuilding(type: BuildingType, graphNode: GraphNode) {
        try {
            const buildingGraphNode = this.buildingGraph.getNodeById(graphNode.id)
            //ensure that the node exists
            if (!buildingGraphNode)  return;
            // ensure that the player can only build ontop of owned nodes
            if (buildingGraphNode.player.user.id!== this.player.user.id) return;
            buildingGraphNode.tryBuild(type);
        } catch(e) { }
    }   
}
