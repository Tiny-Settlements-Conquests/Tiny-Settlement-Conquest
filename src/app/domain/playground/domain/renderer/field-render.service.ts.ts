import { Point } from "../../../primitives/classes/Point";
import { Polygon } from "../../../primitives/classes/Polygon";
import { scale, subtract } from "../../../primitives/functions/util";
import { PolygonRendererService } from "../../../primitives/renderer/polygon-renderer.service";
import { Field } from "../classes/field";

export class FieldRenderService {

  constructor(private readonly ctx: CanvasRenderingContext2D) { }

  render(field: Field,  {fillStyle = 'blue', strokeStyle = '#fcd34d', lineWidth = 5} = {}) {
    const ctx = this.ctx;
    const polygon = field.polygon;
    ctx.save();
	const {points} = polygon; 
	ctx.beginPath();
	ctx.fillStyle = fillStyle;
	ctx.strokeStyle = strokeStyle;
	ctx.moveTo(points[0].x, points[0].y);
	points.forEach((point) => {
		ctx.lineTo(point.x, point.y);
	})
	ctx.closePath();
	ctx.fill();
	ctx.lineWidth = lineWidth;
	ctx.stroke();
	ctx.restore();
  }

}
