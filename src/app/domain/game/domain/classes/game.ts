import { BuildingBuildManager } from "../../../buildings/domain/classes/building-build-manager";
import { RoadBuildManager } from "../../../buildings/domain/classes/road-build-manager";
import { GraphBuildingNode } from "../../../buildings/domain/graph/graph-building-node";
import { Playground } from "../../../playground/domain/classes/playground";
import { Point } from "../../../primitives/classes/Point";
import { Round } from "../../../round/domain/classes/round";
import { GameMode } from "../models/game-mode.model";


export class Game {
  private _mode: GameMode = 'city';

  constructor(
    public readonly playground: Playground,
    private readonly _round: Round,
    private readonly roadBuildManager: RoadBuildManager,
    private readonly buildingBuildManager: BuildingBuildManager
  ) { }

  public set mode(mode: GameMode ) {
    this._mode = mode;
  }

  public generate() {
    //this is demo only and will be removed later
    const node = this.playground.graph?.nodes[2]
    const nodeA = this.playground.graph?.nodes[3]
    const nodeB = this.playground.graph?.nodes[4]
    const nodeC = this.playground.graph?.nodes[5]
    const nodeF = this.playground.graph?.nodes[15]
    const nodeY = this.playground.graph?.nodes[25]
    const nodeYX = this.playground.graph?.nodes[45]

    const player0 = this._round.players[0];
    const player = this._round.players[3];
    const enemyPlayer = this._round.players[1];
    const player3 = this._round.players[2];

    console.log(player);
    if(node && nodeA && nodeB && nodeC && nodeF) {
      this.playground.buildingGraph.tryAddNode(new GraphBuildingNode(node.id,node.position , enemyPlayer));
      this.playground.buildingGraph.tryAddNode(new GraphBuildingNode(nodeA.id,nodeA.position , enemyPlayer));
      this.playground.buildingGraph.tryAddNode(new GraphBuildingNode(nodeB.id,nodeB.position , enemyPlayer));
      this.playground.buildingGraph.tryAddNode(new GraphBuildingNode(nodeC.id,nodeC.position , enemyPlayer));
      this.playground.buildingGraph.tryAddNode(new GraphBuildingNode(nodeF.id,nodeF.position , player));
      this.playground.buildingGraph.tryAddNode(new GraphBuildingNode(nodeY.id,nodeY.position , player3));
      this.playground.buildingGraph.tryAddNode(new GraphBuildingNode(nodeYX.id,nodeYX.position , player0));



      const bNodeA = this.playground.buildingGraph.getNodeById(nodeA.id)
      const bNodeB = this.playground.buildingGraph.getNodeById(nodeB.id)
      const bNodeC = this.playground.buildingGraph.getNodeById(nodeC.id)
      const bNode = this.playground.buildingGraph.getNodeById(node.id)
      if(bNode && bNodeA && bNodeB && bNodeC) {
        bNodeA.addConnectedNode(bNode);
        bNodeA.addConnectedNode(bNodeB);
        bNodeB.addConnectedNode(bNodeC);
        bNodeA.tryBuild('town')
      }
    }
  }

  public checknearbyField(point: Point) {
    console.log("CHECKI CHAN");
    if(this._mode === 'spectate') return;
    const nearestPoint = this.playground.getNearestGraphNode(point);
    if(!nearestPoint) {
      this.roadBuildManager.resetSelectedGraphNode();
      return;
    };

    const player = this._round.activePlayer;
    console.log(player);
    if(!player) return;

    if(this._mode === 'road') {
      this.roadBuildManager.tryBuildRoad(player, nearestPoint);
    } else if(this._mode === 'city') {
      this.buildingBuildManager.tryBuildBuilding(player, 'city', nearestPoint);
    } else if(this._mode === 'town') {
      this.buildingBuildManager.tryBuildBuilding(player, 'town', nearestPoint);
    }
    console.log("GRAPH",this.playground.buildingGraph.nodes);
  }

}
