import { Polygon } from "../classes/Polygon";

export class PolygonRendererService {

  constructor(private readonly ctx: CanvasRenderingContext2D) { }

  render(
    polygon: Polygon,
    { stroke = "blue", lineWidth = 2, fill = "rgba(0,0,255,0.3)", join = "miter" } = {}
   ) {
    const {points} = polygon;
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = join as CanvasLineJoin;
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
   }
}
