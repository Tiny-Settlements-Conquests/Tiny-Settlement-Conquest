import { GraphNode } from "../../../graph/domain/classes/graph-node";
import { Field } from "../../../playground/domain/classes/field";

export class GridField {

  constructor(
    private readonly _field: Field,
    private _graphNodes: GraphNode[],
  ) { }

  public get field(): Field {
    return this._field;
  }

  public get graphNodes(): GraphNode[] {
    return this._graphNodes;
  }

  public addGraphNode(graphNode: GraphNode): void {
    this._graphNodes.push(graphNode);
  }

  public removeGraphNode(graphNode: GraphNode): void {
    const index = this._graphNodes.indexOf(graphNode);
    if (index > -1) {
      this._graphNodes.splice(index, 1);
    }
  }

}
