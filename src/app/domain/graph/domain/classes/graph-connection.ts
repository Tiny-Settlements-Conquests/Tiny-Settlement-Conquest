import { GraphNode } from "./graph-node";

export class GraphConnection {
  

  constructor(
    public readonly target_id: string,
    public readonly source: GraphNode,
    public readonly target: GraphNode
  ) {}

  public unlink() {
    const targetConnections = this.target.connections;
    this.target.connections = this.filterNodes(targetConnections, this.source.id);
    const sourceConnections = this.source.connections;
    this.source.connections = this.filterNodes(sourceConnections, this.target_id);
  }

  private filterNodes(nodes: GraphConnection[], id: string): GraphConnection[] {
    return nodes.filter((n) => n.target_id!== id);
  }

}
