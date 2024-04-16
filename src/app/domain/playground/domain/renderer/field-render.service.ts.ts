import { Point } from "../../../primitives/classes/Point";
import { Polygon } from "../../../primitives/classes/Polygon";
import { add, scale, subtract } from "../../../primitives/functions/util";
import { PolygonRendererService } from "../../../primitives/renderer/polygon-renderer.service";
import { Field } from "../classes/field";

export class FieldRenderService {

	private testImage = new Image();
  constructor(private readonly ctx: CanvasRenderingContext2D) {
    this.testImage.src = "/assets/terrain/sand.png";

   }

  render(field: Field,  {fillStyle = 'blue', backgroundImage = new Image(), strokeStyle = '#fcd34d', lineWidth = 12} = {}) {
    const ctx = this.ctx;
    const polygon = field.polygon;
    ctx.save();
	if(backgroundImage.src) {
		const pattern = this.ctx.createPattern(backgroundImage, 'repeat');
		this.ctx.fillStyle = pattern ?? fillStyle;
	} else {
		ctx.fillStyle = fillStyle;
	}

	const {points} = polygon; 
	ctx.beginPath();
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

  render3DField(field: Field, {fillStyle = 'brown', strokeStyle = 'black', lineWidth = 5} = {}) {
    this.ctx.save();
	const pointsToBegin = [
		field.polygon.points[1],
		field.polygon.points[2],
		field.polygon.points[3],
	]
	const pointsTo: Point[] = [];
	this.ctx.beginPath();
	this.ctx.strokeStyle = strokeStyle;
	this.ctx.fillStyle = fillStyle;
	this.ctx.lineWidth = lineWidth;

	pointsToBegin.forEach((p) => {
		const to = add(p, new Point(15, 10));
		pointsTo.push(to);
		this.ctx.moveTo(p.x, p.y);
		this.ctx.lineTo(to.x, to.y);
		this.ctx.stroke();
	})

	
	this.ctx.moveTo(field.polygon.points[0].x, field.polygon.points[0].y);
	pointsTo.forEach((p) => {
		this.ctx.lineTo(p.x, p.y);
		this.ctx.stroke();
	})
	this.ctx.lineTo(field.polygon.points[3].x, field.polygon.points[3].y);
	this.ctx.fill()

	this.ctx.restore();

  }

}
