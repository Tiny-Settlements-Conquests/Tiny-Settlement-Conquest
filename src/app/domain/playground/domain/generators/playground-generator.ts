import { GraphBuildingNode } from "../../../buildings/domain/graph/graph-building-node";
import { Graph } from "../../../graph/domain/classes/graph";
import { ResourceGenerator } from "../../../resources/classes/generators/resource-generator";
import { Playground } from "../classes/playground";
import { PlaygroundDimensions } from "../models/playground.model";
import { PlaygroundGraphGenerator } from "./playground-graph-generator";
import { PlaygroundGridGenerator } from "./playground-grid-generator";

export class PlaygroundGenerator {

  constructor(
    private readonly gridGenerator: PlaygroundGridGenerator,
    private readonly resourceGenerator: ResourceGenerator,
    private readonly graphGenerator: PlaygroundGraphGenerator,
  ) { }

  public generate(
    dimensions: PlaygroundDimensions,
    buildingGraph: Graph<GraphBuildingNode>
  ): Playground {
    const grid = this.gridGenerator.generateGrid(dimensions);
    const resources = this.resourceGenerator.generateResources(grid, dimensions);
    const graph = this.graphGenerator.generateGraph(
      resources.map((r) => r.field)
    );

    return new Playground(
      grid, 
      resources, 
      graph, 
      buildingGraph, 
      dimensions
    );
  }

}
