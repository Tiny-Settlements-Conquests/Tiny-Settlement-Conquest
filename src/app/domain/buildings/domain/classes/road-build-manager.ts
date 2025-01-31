import { Graph } from "../../../graph/domain/classes/graph";
import { GraphNode } from "../../../graph/domain/classes/graph-node";
import { Player } from "../../../player/domain/classes/player";
import { GraphBuildingNode } from "../graph/graph-building-node";
import { PathType } from "../models/building.model";
import { BuildCostManager } from "./build-cost-manager";

export class RoadBuildManager {

  constructor(
    private readonly buildingGraph: Graph<GraphBuildingNode>,
    private readonly buildingCostManager: BuildCostManager,
  ) {}

  public buildRoadBetween(player: Player, graphNodeA: GraphNode, graphNodeB: GraphNode) {
    if(!this.buildingCostManager.hasPlayerEnoughtResources(player, PathType.ROAD)) throw new Error('HAS NOT ENOUGHT RESOURCES')
    this.checkNodesValidForRoad(player, graphNodeA, graphNodeB);

    this.buildRoadBetweenNodes(player, graphNodeA, graphNodeB);
    this.buildingCostManager.removeResourcesByBuilding(player, PathType.ROAD)
  }

  private checkNodesValidForRoad(player:Player, nodeA: GraphNode, nodeB: GraphNode): void {
    console.log("BUILDINGGRAPH", this.buildingGraph);
    const nodeARealRef = this.buildingGraph.getNodeById(nodeA.id);
    const nodeBRealRef = this.buildingGraph.getNodeById(nodeB.id);
    if (
      nodeARealRef === undefined &&
      nodeBRealRef === undefined
    ) {
      throw new Error("nodes not found");
    }
    if(nodeARealRef === undefined && nodeBRealRef?.player.id !== player.id) {
      throw new Error('Not same player B');
    } else if(nodeBRealRef === undefined && nodeARealRef?.player.id !== player.id) {
      throw new Error('Not same player A');
    } else if(nodeARealRef && nodeBRealRef && nodeARealRef.hasConnectionTo(nodeBRealRef)) {
      throw new Error('has already a connection')
    }

    if (!this.buildingGraph.isNodeNeighbour(nodeA, nodeB)) {
        throw new Error("is no direct neighbour");
    }
  }

  private buildRoadBetweenNodes(player: Player, source: GraphNode, target: GraphNode) {
    const roadNodeSource = new GraphBuildingNode(source.id, source.position, player);
    const roadNodeTarget = new GraphBuildingNode(target.id, target.position, player);

    const nodeARealRef = this.buildingGraph.getNodeById(roadNodeSource.id);
    const nodeBRealRef = this.buildingGraph.getNodeById(roadNodeTarget.id);

    if (nodeBRealRef && nodeARealRef) {
      this.buildingGraph.tryAddConnection(nodeARealRef, nodeBRealRef);
    } else {
      if(nodeBRealRef) {
        nodeBRealRef.addConnectedNode(roadNodeSource);
      } else if(nodeARealRef) {
        nodeARealRef.addConnectedNode(roadNodeTarget);
      }
      this.buildingGraph.tryAddNode(roadNodeSource);
      this.buildingGraph.tryAddNode(roadNodeTarget);
    }
  }
}
