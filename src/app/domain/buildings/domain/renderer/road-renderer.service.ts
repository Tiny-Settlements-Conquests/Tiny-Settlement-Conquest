import { Point } from "../../../primitives/classes/Point";
import { Polygon } from "../../../primitives/classes/Polygon";
import { angle, subtract, translate } from "../../../primitives/functions/util";
import { PolygonRendererService } from "../../../primitives/renderer/polygon-renderer.service";
import { Road } from "../classes/road";

export class RoadRendererService {

  constructor(private readonly ctx: CanvasRenderingContext2D) { }

  public render(startPoint: Point, endPoint: Point, color: string): void {
    this.renderBase(startPoint, endPoint, color);
    this.renderMarkings(startPoint, endPoint);
    const polygonRenderer = new PolygonRendererService(this.ctx);
  }

  private renderBase(startPoint: Point, endPoint: Point, baseColor: string) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = 15;
    ctx.stroke();
    ctx.restore();
  }

  private renderMarkings(startPoint: Point, endPoint: Point) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.strokeStyle = 'white';
    ctx.setLineDash([5, 10]);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

}
