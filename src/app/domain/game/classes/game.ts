import { BuildingBuildManager } from "../../buildings/domain/classes/building-build-manager";
import { RoadBuildManager } from "../../buildings/domain/classes/road-build-manager";
import { GraphBuildingNode } from "../../buildings/domain/graph/graph-building-node";
import { GraphNode } from "../../graph/domain/classes/graph-node";
import { Player } from "../../player/domain/classes/player";
import { Field } from "../../playground/domain/classes/field";
import { Playground } from "../../playground/domain/classes/playground";
import { Point } from "../../primitives/classes/Point";
import { ResourceField } from "../../resources/models/resource-field.model";

export class Game {
  private _mode: 'road'| 'build' | 'spectate' = 'build';

  constructor(
    public readonly playground: Playground,
    private readonly player: Player,
    private readonly roadBuildManager: RoadBuildManager,
    private readonly buildingBuildManager: BuildingBuildManager
  ) { }

  public generate() {
    this.playground.generatePlayground();
    //this is demo only and will be removed later
    const node = this.playground.graph?.nodes[2]
    const nodeA = this.playground.graph?.nodes[3]
    const nodeB = this.playground.graph?.nodes[4]
    if(node && nodeA && nodeB) {
      this.playground.buildingGraph.tryAddNode(new GraphBuildingNode(node.id,node.position , this.player));
      this.playground.buildingGraph.tryAddNode(new GraphBuildingNode(nodeA.id,nodeA.position , this.player));
      this.playground.buildingGraph.tryAddNode(new GraphBuildingNode(nodeB.id,nodeB.position , this.player));
      const bNodeA = this.playground.buildingGraph.getNodeById(nodeA.id)
      const bNodeB = this.playground.buildingGraph.getNodeById(nodeB.id)
      const bNode = this.playground.buildingGraph.getNodeById(node.id)
      if(bNode && bNodeA && bNodeB) {
        bNodeA.addConnectedNode(bNode);
        bNodeA.addConnectedNode(bNodeB);
        bNodeA.tryBuild('town')
      }


    }
  }

  public render() {
    this.playground.render();
  }

  public checknearbyField(point: Point) {
    if(this._mode === 'spectate') return;
    const nearestPoint = this.playground.getNearestGraphNode(point);
    if(!nearestPoint) {
      this.roadBuildManager.resetSelectedGraphNode();
      return;
    };
    console.log("GRAPH", this.playground.buildingGraph)


    if(this._mode === 'road') {
      
      this.roadBuildManager.tryBuildRoad(nearestPoint);
    } else if(this._mode === 'build') {
      this.buildingBuildManager.tryBuildBuilding('town', nearestPoint);
      // const buildingNode = new GraphBuildingNode(nearestPoint.id, nearestPoint.position, this.player);
      
      // this.playground.extendBuildingGraph(buildingNode)
      console.log(this.playground);
    }

  }

  public save() {
    localStorage.setItem('grid', JSON.stringify({
      grid: this.playground.gridField, 
      resources: this.playground.resourceFields
    }));
  }

  public load() {
    const grid = localStorage.getItem('grid');
    if (!grid) return;
    const parsedPlayground = JSON.parse(grid);
    const grids = parsedPlayground.grid.map((f: any) => new Field(f.polygon, f.colIndex, f.rowIndex));
    const resources = parsedPlayground.resources.map(
      (f: ResourceField) => this.playground.resourceGenerator.getResourceByType(f.typ, new Field(f.field.polygon, f.field.colIndex, f.field.rowIndex), f.value));
    
    this.playground.loadPlayground(grids, resources);
  }
}
