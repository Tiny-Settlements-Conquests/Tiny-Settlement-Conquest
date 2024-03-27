import { GraphBuildingNode } from "../../../buildings/domain/graph/graph-building-node";
import { Graph } from "../../../graph/domain/classes/graph";
import { GraphConnection } from "../../../graph/domain/classes/graph-connection";
import { GraphNode } from "../../../graph/domain/classes/graph-node";
import { Point } from "../../../primitives/classes/Point";
import { distance } from "../../../primitives/functions/util";
import { PointRendererService } from "../../../primitives/renderer/point-renderer.service";
import { ResourceGenerator } from "../../../resources/classes/generators/resource-generator";
import { ResourceField } from "../../../resources/models/resource-field.model";
import { PlaygroundGraphGenerator } from "../generators/playground-graph-generator";
import { PlaygroundGridGenerator } from "../generators/playground-grid-generator";
import { PlaygroundDimensions } from "../models/playground.model";
import { PlaygroundGraphRenderer } from "../renderer/playground-graph-renderer";
import { Field } from "./field";

export interface PlaygroundRenderer {
  render(grid: Field[], resources: ResourceField[]): void;
}

export class Playground {
  public get graph(): Graph {
    return this._gridGraph;
  }

  public get buildingGraph(): Graph<GraphBuildingNode> {
    return this._buildingGraph
  }

  constructor(
    private readonly _grid: Field[],
    private readonly _resources: ResourceField[],
    private readonly _gridGraph: Graph,
    private readonly _buildingGraph: Graph<GraphBuildingNode>,
    // private readonly renderer: PlaygroundRenderer,
    // public readonly pointRenderer: PointRendererService,
    // public readonly graphRenderer: PlaygroundGraphRenderer,
    // private readonly _buildingGraph: Graph<GraphBuildingNode>,
    public readonly dimensions: PlaygroundDimensions = { fieldWidth: 9, fieldHeight: 9 },
  ) { }

  public render(): void {
    // this.renderer.render(this._grid, this._resources);
    // ! build a buildingGraph renderer
    // this.graphRenderer.render(this._buildingGraph);
  }

  public loadPlayground(grid: Field[], resources: ResourceField[]): void {
    // this._grid = grid;
    // this._resources = resources;
  }

  public getNearestGraphNode(point: Point): GraphNode | undefined {
    const graph = this.graph;
    if(!graph) return;

    return graph.nodes.find((p) => distance(p.position, point) < 10 );
  }

  public importPlayground() {

  }

  public exportPlayground() {

  }

  public get gridField(): Field[] {
    return this._grid;
  }

  public get resourceFields(): ResourceField[] {
    return this._resources;
  }

  public get width(): number {
    return this.dimensions.fieldWidth;
  }

  public get height(): number {
    return this.dimensions.fieldHeight;
  }


}
