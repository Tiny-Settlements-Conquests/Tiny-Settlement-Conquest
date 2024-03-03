import { Graph } from "../../../graph/domain/classes/graph";
import { GraphNode } from "../../../graph/domain/classes/graph-node";
import { Player } from "../../../player/domain/classes/player";
import { Playground } from "../../../playground/domain/classes/playground";
import { GraphBuildingNode } from "../graph/graph-building-node";

export class RoadBuildManager {
  private _sourceGraphNode: GraphNode | null = null;

  constructor(
    private readonly buildingGraph: Graph,
    private readonly player: Player
  ) {}

  public resetSelectedGraphNode(){
    this._sourceGraphNode = null;
  }

  public tryBuildRoad(graphNode: GraphNode) {
    try {
        if(!this._sourceGraphNode) {
          this._sourceGraphNode = graphNode;
          return;
        }
        this.checkNodesValidForRoad(graphNode, this._sourceGraphNode);
    
        this.buildRoadBetweenNodes(graphNode, this._sourceGraphNode);

    } catch(e) {}
  }

  private checkNodesValidForRoad(nodeA: GraphNode, nodeB: GraphNode): void {
    if (
      this.buildingGraph.getNodeById(nodeA.id) === undefined &&
      this.buildingGraph.getNodeById(nodeB.id) === undefined
    ) {
      throw new Error("nodes not found");
    }

    if (!this.buildingGraph.isNodeNeighbour(nodeA, nodeB)) {
        throw new Error("is no direct neighbour");
    }
  }

  private buildRoadBetweenNodes(source: GraphNode, target: GraphNode) {
    const roadNodeSource = new GraphBuildingNode(source.id, source.position, this.player);
    const roadNodeTarget = new GraphBuildingNode(target.id, target.position, this.player);

    const nodeARealRef = this.buildingGraph.getNodeById(roadNodeSource.id);
    const nodeBRealRef = this.buildingGraph.getNodeById(roadNodeTarget.id);

    if (nodeBRealRef && nodeARealRef) {
      this.buildingGraph.tryAddConnection(nodeARealRef, nodeBRealRef);
    } else {
      console.log("jo",roadNodeSource);
      roadNodeSource.addConnectedNode(roadNodeTarget);
      this.buildingGraph.tryAddNode(roadNodeSource);
      this.buildingGraph.tryAddNode(roadNodeTarget);
    }
    this.resetSelectedGraphNode();
  }
}
