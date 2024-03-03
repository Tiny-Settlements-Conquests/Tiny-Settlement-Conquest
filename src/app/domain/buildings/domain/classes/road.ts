import { Point } from "../../../primitives/classes/Point";

export class Road {

  constructor(private readonly _startPoint: Point, private readonly _endPoint: Point) { }

  public get startPoint(): Point {
    return this._startPoint;
  }

  public get endPoint(): Point {
    return this._endPoint;
  }
}
