import { Point } from "../../../primitives/classes/Point";
import { Polygon } from "../../../primitives/classes/Polygon";
import { add, subtract } from "../../../primitives/functions/util";

export class Field {

	constructor(
		public readonly polygon: Polygon, 
		public readonly rowIndex: number,
		public readonly colIndex: number,
	) {}

	public get id() {
		return this.rowIndex + '-' + this.colIndex;
	}

	public get centerPoint(): Point {
		const points = this.polygon.points;
		let sumX = 0;
		let sumY = 0;

		for (const point of points) {
			sumX += point.x;
			sumY += point.y;
		}

		const centerX = sumX / points.length;
		const centerY = sumY / points.length;

		return new Point(centerX, centerY);
	}
}
