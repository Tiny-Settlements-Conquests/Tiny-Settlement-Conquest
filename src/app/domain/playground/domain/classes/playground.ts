import { GraphBuildingNode } from "../../../buildings/domain/graph/graph-building-node";
import { Graph } from "../../../graph/domain/classes/graph";
import { GraphNode } from "../../../graph/domain/classes/graph-node";
import { Point } from "../../../primitives/classes/Point";
import { distance } from "../../../primitives/functions/util";
import { ResourceField } from "../../../resources/domain/models/resource-field.model";
import { PlaygroundDimensions, PlaygroundInformation } from "../models/playground.model";
import { Field } from "./field";


//todo hier brauchen wir noch eine struktur die einfacher die fields und die graphNodes miteinander verknüpft
export class Playground {
  private readonly _grid: Field[];
  private readonly _resources: ResourceField[];
  private readonly _gridGraph: Graph;
  private readonly _buildingGraph: Graph<GraphBuildingNode>;
  private readonly _dimensions: PlaygroundDimensions;

  public get graph(): Graph {
    return this._gridGraph;
  }

  public get buildingGraph(): Graph<GraphBuildingNode> {
    return this._buildingGraph
  }

  constructor(data:PlaygroundInformation) { 
    const {dimensions, grid, resources, gridGraph, buildingGraph} = data;
    this._dimensions = dimensions;
    this._grid = grid;
    this._resources = resources;
    this._gridGraph = gridGraph;
    this._buildingGraph = buildingGraph;
  }

  public getNearestGraphNode(point: Point): GraphNode | undefined {
    const graph = this.graph;
    if(!graph) return;

    return graph.nodes.find((p) => distance(p.position, point) < 10 );
  }

  public exportPlayground(): PlaygroundInformation {
    return {
      grid: this._grid,
      resources: this._resources,
      gridGraph: this._gridGraph,
      buildingGraph: this._buildingGraph,
      dimensions: this._dimensions,
    }
  }

  public get gridField(): Field[] {
    return this._grid;
  }

  public get dimensions(): PlaygroundDimensions {
    return this._dimensions;
  }

  public get resourceFields(): ResourceField[] {
    return this._resources;
  }

  public get width(): number {
    return this._dimensions.playgroundWidth;
  }

  public get height(): number {
    return this._dimensions.playgroundHeight;
  }


}
