import { GraphBuildingNode } from "../../../buildings/domain/graph/graph-building-node";
import { CityRendererService } from "../../../buildings/domain/renderer/city-renderer.service";
import { RoadRendererService } from "../../../buildings/domain/renderer/road-renderer.service";
import { TownRendererService } from "../../../buildings/domain/renderer/town-renderer.service";
import { Graph } from "../../../graph/domain/classes/graph";
import { PointRendererService } from "../../../primitives/renderer/point-renderer.service";

export class PlaygroundGraphRenderer {
    constructor(
        private readonly ctx: CanvasRenderingContext2D, 
        private readonly townRenderer: TownRendererService,
        private readonly cityRenderer: CityRendererService,
    ){}

    public render(graph: Graph<GraphBuildingNode>) {
        const {nodes} = graph;
        if(nodes.length === 0) return;
        const pointRenderer = new PointRendererService(this.ctx);
        const ctx = this.ctx;
        const roadRenderer = new RoadRendererService(this.ctx);

        nodes.forEach((node) => {
            node.connections.forEach((connection) => {
                roadRenderer.render(
                    connection.source.position, 
                    connection.target.position,
                    node.player.color
                );
            })
        })
        nodes.forEach((node) => {

            

            if(node.hasBuilding()) {
                if(node.building?.type === 'town') {
                    this.townRenderer.render(
                        node.position, 
                        node.player.color, 
                        {
                            houseHeight: 40,
                            houseSize: 20
                        }
                    );
                } else {
                    this.cityRenderer.render(
                        node.position,
                        node.player.color
                    );
                }
                
                // pointRenderer.render(node.position, { fillStyle: 'red'});
            } else {
                pointRenderer.render(node.position, { fillStyle: node.player.color, strokeStyle: node.player.color});
            }
            
        })
    }

    public renderDebugInformation(graph: Graph) {
        const {nodes} = graph;
        if(nodes.length === 0) return;
        const pointRenderer = new PointRendererService(this.ctx);

        nodes.forEach((node) => {
            pointRenderer.renderWithText(node.position, `id: ${node.id}`)
        })
    }
}