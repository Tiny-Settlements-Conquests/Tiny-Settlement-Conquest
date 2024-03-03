import { Point } from "../classes/Point";

export class PointRendererService {

  constructor(private readonly ctx: CanvasRenderingContext2D) { }

  public render(point: Point, {fillStyle = 'blue', strokeStyle = 'black', lineWidth = 5} = {}) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

}
