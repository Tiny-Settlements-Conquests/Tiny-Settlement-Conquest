import { GraphBuildingNode } from "../../../buildings/domain/graph/graph-building-node";
import { Graph } from "../../../graph/domain/classes/graph";
import { MapInformation } from "../../../map-selection/domain/models/map-selection.model";
import { Playground } from "../../../playground/domain/classes/playground";
import { PlaygroundGraphGenerator } from "../../../playground/domain/generators/playground-graph-generator";

export function loadPlayground(mapInformation: MapInformation) {
    const {fields, resourceFields, dimensions} = mapInformation.playgroundInformation
    const graphGenerator = new PlaygroundGraphGenerator();
    const graph = graphGenerator.generateGraph(
        resourceFields.map((r) => r.field)
    );
    const buildingGraph = new Graph<GraphBuildingNode>()
    return new Playground({
        buildingGraph,
        dimensions,
        grid: fields,
        resources: resourceFields,
        gridGraph: graph 
    });
}