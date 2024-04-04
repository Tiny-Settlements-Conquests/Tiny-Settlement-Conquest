import { Point } from "../../../primitives/classes/Point";
import { GraphConnection } from "./graph-connection";

export class GraphNode {

  private _connections: GraphConnection[] = [];

  public get connections(): GraphConnection[] {
    return this._connections;
  }

  public set connections(connections: GraphConnection[]) {
    this._connections = connections;
  }

  public get connectedPoints(): GraphNode[] {
    return this.connections.map((c) => c.target);
  }

  constructor(
    public readonly id: string,
    public readonly position: Point
  ) { }

  public addConnectedNode(node: GraphNode): void {
    // Check if a connection already exists between this node and the target node
    if (this.connections.some(connection => connection.target.id === node.id)) {
      return;
    }
    
    // Create a new connection
    const connection = new GraphConnection(node.id, this, node);
    
    // Add the new connection to the connections array
    this._connections.push(connection);
    node._connections.push(new GraphConnection(this.id, node, this));
  }

  public removeConnectedNode(targetNode: GraphNode): void {
    const connection = this.connections.find((c) => c.target.id === targetNode.id);
    if (connection) {
      connection.unlink();
    } 
  }

  public hasConnectionTo(target: GraphNode) {
    return this.connections.find((c) => c.target_id === target.id)
  }

}
