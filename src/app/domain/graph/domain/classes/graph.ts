import { GraphConnection } from "./graph-connection";
import { GraphNode } from "./graph-node";

export class Graph<T extends GraphNode = GraphNode> {

  constructor(
    private readonly _id: string | number = 0,
    private _nodes: T[] = [],
  ) { }

  public get id() {
    return this._id;
  }

  public get nodes() {
    return this._nodes;
  }

  public tryAddNode(node: T): void {
    try {
      if(this._nodes.some(n => n.id === node.id)) throw new Error('already exists');
      console.log("ok")
      this._nodes.push(node);

    } catch(e) {
      console.log("err")
    }
  }

  public tryAddConnection(source: T, target: T): void {
    source.addConnectedNode(target);
  }

  public getUniqueNodes(): T[] {
    return this._nodes.filter((node, index) => this._nodes.findIndex(n => n.id === node.id) === index);
  }

  public getUniqueConnections(): GraphConnection[] {
    return this._nodes.flatMap(node => node.connections).filter((connection, index) => this._nodes.flatMap(n => n.connections));
  }

  public getNodeById(id: string): T | undefined {
    return this._nodes.find(node => node.id === id);
  }

  public isNodeNeighbour(node1: T, node2: T): boolean {
    console.log(node1.connections.some(connection => connection.target.id === node2.id))
    return node1.connections.some(connection => connection.target.id === node2.id);
  }

}
