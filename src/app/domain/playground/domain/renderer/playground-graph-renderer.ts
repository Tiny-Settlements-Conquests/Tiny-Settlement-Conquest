import { computeMsgId } from "@angular/compiler";
import { Graph } from "../../../graph/domain/classes/graph";
import { GraphConnection } from "../../../graph/domain/classes/graph-connection";
import { PointRendererService } from "../../../primitives/renderer/point-renderer.service";
import { GraphBuildingNode } from "../../../buildings/domain/graph/graph-building-node";
import { Polygon } from "../../../primitives/classes/Polygon";
import { Point } from "../../../primitives/classes/Point";
import { add, average, distance, dot, getFake3dPoint, magnitude, normalize, scale, subtract } from "../../../primitives/functions/util";
import { PolygonRendererService } from "../../../primitives/renderer/polygon-renderer.service";
import { Viewport } from "../../../viewport/classes/viewport";
import { TownRendererService } from "../../../buildings/domain/renderer/town-renderer.service";
import { RoadRendererService } from "../../../buildings/domain/renderer/road-renderer.service";

export class PlaygroundGraphRenderer {
    constructor(
        private readonly ctx: CanvasRenderingContext2D, 
        private readonly townRenderer: TownRendererService,
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
                
                // pointRenderer.render(node.position, { fillStyle: 'red'});
                this.townRenderer.renderHouse(
                    node.position, 
                    node.player.color
                );
            } else {
                pointRenderer.render(node.position, { fillStyle: node.player.color, strokeStyle: node.player.color});
            }
            
        })
    }
}