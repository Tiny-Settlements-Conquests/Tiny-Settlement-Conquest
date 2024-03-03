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
  private _resources: ResourceField[] = [];
  private _grid: Field[] = [];
  private _graph: Graph | null = null;

  public get graph(): Graph | null {
    return this._graph;
  }

  public get buildingGraph(): Graph<GraphBuildingNode> {
    return this._buildingGraph
  }

  constructor(
    private readonly gridGenerator: PlaygroundGridGenerator,
    private readonly renderer: PlaygroundRenderer,
    public readonly resourceGenerator: ResourceGenerator,
    public readonly graphGenerator: PlaygroundGraphGenerator,
    public readonly pointRenderer: PointRendererService,
    public readonly graphRenderer: PlaygroundGraphRenderer,
    private readonly _buildingGraph: Graph<GraphBuildingNode>,
    public readonly dimensions: PlaygroundDimensions = { fieldWidth: 9, fieldHeight: 9 },
  ) { }

  public generatePlayground(): void {
    //todo eigenen generator für den playground erstellen
    this._grid = this.gridGenerator.generateGrid(this.dimensions);
    this._resources = this.resourceGenerator.generateResources(this._grid, this.dimensions);
    this._graph = this.graphGenerator.generateGraph(
      this._resources.map((r) => r.field)
    )
    console.log(
      this._graph
    )
  }

  public render(): void {
    this.renderer.render(this._grid, this._resources);
    // todo build a buildingGraph renderer
    this.graphRenderer.render(this._buildingGraph);
  }

  public loadPlayground(grid: Field[], resources: ResourceField[]): void {
    this._grid = grid;
    this._resources = resources;
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
