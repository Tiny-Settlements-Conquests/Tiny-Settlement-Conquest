import { Field } from "../../domain/classes/field";
import { Graph } from "../../../graph/domain/classes/graph";
import { GraphNode } from "../../../graph/domain/classes/graph-node";

export class PlaygroundGraphGenerator {
  // public generateGraph(fields: Field[]): any {
    public generateGraph(fields: Field[]): Graph {
      // Generate polygon graphs
      const subGraphs = this.generateSubGraphsForFields(fields);
      console.log(subGraphs);
      
      return this.combineSubgraphs(subGraphs);
  }
  
  private generateSubGraphsForFields(fields: Field[]): Graph[] {
      return fields.map((field, index) => {
          const polyNodes: GraphNode[] = [];
          
          field.polygon.points.forEach((point, i, { length }) => {
              const node = new GraphNode(
                  `${field.id}-${i}`,
                  point,
              );
  
              if (i === length - 1) {
                  polyNodes[0]?.addConnectedNode(node);
                  node.addConnectedNode(polyNodes[0]); // Connect last node to the first node
              } 
              if (i - 1 >= 0) {
                  polyNodes[i - 1]?.addConnectedNode(node);
                  node.addConnectedNode(polyNodes[i - 1]);
              }
              polyNodes.push(node);
          });
          
          return new Graph(index, polyNodes);
      });
  }
  
  private combineSubgraphs(subGraphs: Graph[]): Graph {
      const combinedNodes: GraphNode[] = [];
      const filteredIds: string[] = [];
      
      subGraphs.forEach((subGraph) => {
          subGraph.nodes.forEach((node) => {
              if (!filteredIds.includes(node.id)) {
                  const availableGraphs = subGraphs.filter((sg) => sg.id !== subGraph.id);
                  const availableNodes = availableGraphs.map((g) => g.nodes).flat();
                  
                  // Check if node is overlapping with another node
                  const overlappingNodes = availableNodes.filter((n) => n.position.equals(node.position));
                  overlappingNodes.forEach((overlappingNode) => {
                      // Unlink all old connections and allocate new connection
                        overlappingNode.connectedPoints.forEach((connectedPoint) => {
                            connectedPoint.removeConnectedNode(overlappingNode);
                            connectedPoint.addConnectedNode(node);
                            node.addConnectedNode(connectedPoint);
                        });
                      filteredIds.push(overlappingNode.id);
                  });
                  
                  combinedNodes.push(node);
              }
          });
      });
      
      return new Graph(0, combinedNodes);
  }
}
