import { Graph } from "../../../graph/domain/classes/graph";
import { GraphNode } from "../../../graph/domain/classes/graph-node";
import { Player } from "../../../player/domain/classes/player";
import { Point } from "../../../primitives/classes/Point";
import { GraphBuildingNode } from "../graph/graph-building-node";
import { BuildingType } from "../models/building.model";
import { BuildCostManager } from "./build-cost-manager";

export class BuildingBuildManager {
    constructor(
        private readonly buildingGraph: Graph<GraphBuildingNode>,
        private readonly playgroundGraph: Graph,
        private readonly buildingCostManager: BuildCostManager,
    ) {}

    public tryBuildBuilding(player: Player, type: BuildingType, graphNode: GraphNode) {
        try {
            const buildingGraphNode = this.buildingGraph.getNodeById(graphNode.id)
            //ensure that the node exists
            if (!buildingGraphNode)  return;
            this.buildingCostManager.tryIfBuildingCanBeBuild(player, type);
            this.checkIfBuildingIsOfSamePlayer(player, buildingGraphNode);
            this.checkBuildingPosition(buildingGraphNode);
            this.buildingCostManager.removeResourcesByBuilding(player, type)
            // ensure that the player can only build ontop of owned nodes
            buildingGraphNode.tryBuild(type);
        } catch(e) { 
            console.log("no", e) 
        }
    }   

    private checkIfBuildingIsOfSamePlayer(player: Player, buildingGraphNode: GraphBuildingNode) {
        if (buildingGraphNode.player.id!== player.id) throw new Error('not same player!!!');
    }

    public checkBuildingPosition(buildingGraphNode: GraphBuildingNode) {
        const graphNode = this.playgroundGraph.getNodeById(buildingGraphNode.id);
        if(!graphNode) throw new Error('Requested node does not exist');

        console.log(graphNode);
        this.checkIfBuildingIsBuild(graphNode)
        
        graphNode.connectedPoints.forEach(node => {
            this.checkIfBuildingIsBuild(node);
        })
    }

    public getOwnerOfBuildingByPoint(point: Point) {
        const buildingGraphNode = this.buildingGraph.getNodeByPoint(point);
        if(!buildingGraphNode) throw new Error('Requested node does not exist');
        if(!buildingGraphNode.hasBuilding()) throw new Error('There is no building on this node!');
        return buildingGraphNode.player;
    }

    private checkIfBuildingIsBuild(graphNode: GraphNode) {
        const buildingGraphNode = this.buildingGraph.getNodeById(graphNode.id)
        // if node doesnt exist its okay because there is no building nor claimed land
        if (!buildingGraphNode) return;
        if (buildingGraphNode.hasBuilding()) throw new Error('There is already a building on this node!');
    }
}
