import { GraphBuildingNode } from "../../../buildings/domain/graph/graph-building-node";
import { Graph } from "../../../graph/domain/classes/graph";
import { ResourceGenerator } from "../../../resources/domain/classes/generators/resource-generator";
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
    const fields = this.gridGenerator.generateGrid(dimensions);
    const resources = this.resourceGenerator.generateResources(fields, dimensions);
    const graph = this.graphGenerator.generateGraph(
      resources.map((r) => r.field)
    );

    // const test = new Grid
    // const gridFields = 

    return new Playground(
      fields, 
      resources, 
      graph, 
      buildingGraph, 
      dimensions
    );
  }

}
