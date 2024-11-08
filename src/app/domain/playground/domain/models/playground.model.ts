import { GraphBuildingNode } from "../../../buildings/domain/graph/graph-building-node";
import { Graph } from "../../../graph/domain/classes/graph";
import { ResourceField } from "../../../resources/domain/models/resource-field.model";
import { Field } from "../classes/field";

export interface PlaygroundDimensions {
    playgroundWidth: number,
    playgroundHeight: number
}

export interface PlaygroundInformation {
    grid: Field[],
    resources: ResourceField[],
    gridGraph: Graph,
    buildingGraph: Graph<GraphBuildingNode>,
    dimensions: PlaygroundDimensions,
}