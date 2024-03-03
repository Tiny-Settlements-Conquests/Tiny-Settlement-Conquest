export class Point {
  constructor(public x: number, public y: number) { }

  public equals(point: Point): boolean {
    return this.x === point.x && this.y === point.y;
  }
}
