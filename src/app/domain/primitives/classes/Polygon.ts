import { Point } from "./Point";

export class Polygon {

  constructor(public points: Point[]) { }

  public get width(): number {
    return Math.max(...this.points.map((p) => p.x)) - Math.min(...this.points.map((p) => p.x));
  }

  public get height(): number {
    return Math.max(...this.points.map((p) => p.y)) - Math.min(...this.points.map((p) => p.y));
  } 

}
