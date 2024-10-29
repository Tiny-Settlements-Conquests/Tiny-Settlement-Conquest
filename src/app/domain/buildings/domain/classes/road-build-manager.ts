import { Graph } from "../../../graph/domain/classes/graph";
import { GraphNode } from "../../../graph/domain/classes/graph-node";
import { Player } from "../../../player/domain/classes/player";
import { GraphBuildingNode } from "../graph/graph-building-node";
import { PathType } from "../models/building.model";
import { BuildCostManager } from "./build-cost-manager";

export class RoadBuildManager {
  private _sourceGraphNode: GraphNode | null = null;

  constructor(
    private readonly buildingGraph: Graph<GraphBuildingNode>,
    private readonly buildingCostManager: BuildCostManager,
  ) {}

  public resetSelectedGraphNode(){
    this._sourceGraphNode = null;
  }

  public getSelectedGraphNode(): GraphNode | null {
    return this._sourceGraphNode;
  }

  public setSelectedGraphNode(node: GraphNode): void {
    this._sourceGraphNode = node;
  }

  public tryBuildRoadBetween(player: Player, graphNodeA: GraphNode, graphNodeB: GraphNode) {
    try {
      this.buildingCostManager.hasPlayerEnoughtResources(player, PathType.ROAD);
      this.checkNodesValidForRoad(player, graphNodeA, graphNodeB);
  
      this.buildRoadBetweenNodes(player, graphNodeA, graphNodeB);
      this.buildingCostManager.removeResourcesByBuilding(player, PathType.ROAD)
  } catch(e) {
    this.resetSelectedGraphNode();
  }
  }

  /**
   * @deprecated use tryBuildRoadBetween instead
   * @param player 
   * @param graphNode 
   * @returns 
   */
  public buildRoad(player: Player, graphNode: GraphNode) {
      if(!this._sourceGraphNode) {
        this._sourceGraphNode = graphNode;
        return;
      }
      this.buildingCostManager.hasPlayerEnoughtResources(player, PathType.ROAD);
      this.checkNodesValidForRoad(player, graphNode, this._sourceGraphNode);
  
      this.buildRoadBetweenNodes(player, graphNode, this._sourceGraphNode);
      this.buildingCostManager.removeResourcesByBuilding(player, PathType.ROAD)
  }

  private checkNodesValidForRoad(player:Player, nodeA: GraphNode, nodeB: GraphNode): void {
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
    this.resetSelectedGraphNode();
  }
}
