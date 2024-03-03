import { Point } from "../../../primitives/classes/Point";
import { Polygon } from "../../../primitives/classes/Polygon";
import { add } from "../../../primitives/functions/util";
import { PlaygroundDimensions } from "../models/playground.model";
import { Field } from "../classes/field";

export class PlaygroundGridGenerator {

  public constructor(
    private readonly scale: number = 1.4
  ) {}

  private defaultGameFieldPoly() {
    return new Polygon([
        new Point(100 * this.scale, 100 * this.scale),
        new Point(160 * this.scale, 140 * this.scale),
        new Point(160 * this.scale, 200 * this.scale),
        new Point(100 * this.scale, 240 * this.scale),
        new Point(40 * this.scale, 200 * this.scale),
        new Point(40 * this.scale, 140 * this.scale),
      ])
  }

  public generateGrid(dimensions: PlaygroundDimensions): Field[] {
    const startPoly = this.defaultGameFieldPoly()

	  const { fieldWidth, fieldHeight } = dimensions;
    const { width, height } = startPoly;
    const generatedFields: Field[] = [];

    for (let i = 0; i < fieldHeight; i++) {
        const rowStartPoly = this.generateRowStartPolygon(startPoly, width, height, i);
        const rowFields = this.generateRowFields(i, rowStartPoly, fieldWidth, width);
        generatedFields.push(...rowFields);
    }

    return generatedFields;
  }

  private generateRowStartPolygon(startPoly: Polygon, width: number, height: number, rowIndex: number): Polygon {
    const newX = this.isEven(rowIndex) ? width : width / 2;
    const newY = (height * rowIndex) - (40 * this.scale * rowIndex);
    return new Polygon(startPoly.points.map(p => add(p, new Point(newX, newY))));
  }

  private generateRowFields(rowIndex: number, rowStartPoly: Polygon, fieldWidth: number, width: number): Field[] {
    const rowFields: Field[] = [];
    for (let j = 0; j < fieldWidth; j++) {
      const fieldPolygon = rowStartPoly.points.map((p) => add(p, new Point(width * j, 0)));
      rowFields.push(
        new Field(
          new Polygon(
            fieldPolygon
          ), 
          rowIndex, 
          j
        )
      );
    }
    return rowFields;
  }

  private isEven(number: number): boolean {
    return number % 2 === 0;
  }
}
