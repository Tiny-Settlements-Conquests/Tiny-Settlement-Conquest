import { Graph } from "../../../graph/domain/classes/graph";
import { GraphNode } from "../../../graph/domain/classes/graph-node";
import { Player } from "../../../player/domain/classes/player";
import { Playground } from "../../../playground/domain/classes/playground";
import { GraphBuildingNode } from "../graph/graph-building-node";
import { BuildCostManager } from "./build-cost-manager";

export class RoadBuildManager {
  private _sourceGraphNode: GraphNode | null = null;

  constructor(
    private readonly buildingGraph: Graph<GraphBuildingNode>,
    private readonly _buildCostManager: BuildCostManager
  ) {}

  public resetSelectedGraphNode(){
    this._sourceGraphNode = null;
  }

  public tryBuildRoad(player: Player, graphNode: GraphNode) {
    try {
        if(!this._sourceGraphNode) {
          this._sourceGraphNode = graphNode;
          return;
        }
        this._buildCostManager.tryBuild(player, 'road')
        this.checkNodesValidForRoad(player, graphNode, this._sourceGraphNode);
    
        this.buildRoadBetweenNodes(player, graphNode, this._sourceGraphNode);

    } catch(e) {
      console.log("REHSET")
      this.resetSelectedGraphNode();
    }
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
