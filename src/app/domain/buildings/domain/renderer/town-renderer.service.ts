import { Point } from "../../../primitives/classes/Point";
import { Polygon } from "../../../primitives/classes/Polygon";
import { getFake3dPoint, average, distance } from "../../../primitives/functions/util";
import { PolygonRendererService } from "../../../primitives/renderer/polygon-renderer.service";
import { Viewport } from "../../../viewport/classes/viewport";

export class TownRendererService {

  constructor(
    private readonly polygonRenderer: PolygonRendererService,
    private readonly viewPort: Viewport
  ) { }

  public render(centerPoint: Point, color: string, { houseSize = 13, houseHeight = 80 } = { houseSize: 13, houseHeight: 80}) {
    const viewPoint = this.viewPort.getViewPoint();
    const basePoints = this.calculateBasePoints(centerPoint, houseSize);
    const topPoints = this.calculateTopPoints(basePoints, viewPoint, houseHeight);
    const ceiling = this.createCeilingPolygon(topPoints);

    const sides = this.createSidePolygons(basePoints, topPoints);

    const roofPolys = this.createRoofPolygons(ceiling, basePoints, houseHeight, viewPoint);

    this.renderBase(basePoints);
    this.renderSides(sides);
    this.renderCeiling(ceiling);
    this.renderRoof(roofPolys, color);
  }

  private calculateBasePoints(centerPoint: Point, size: number): Point[] {
    const topLeft = new Point(centerPoint.x - size, centerPoint.y - size);
    const topRight = new Point(centerPoint.x + size, centerPoint.y - size);
    const bottomRight = new Point(centerPoint.x + size, centerPoint.y + size);
    const bottomLeft = new Point(centerPoint.x - size, centerPoint.y + size);
    return [topLeft, topRight, bottomRight, bottomLeft];
  }

  private calculateTopPoints(basePoints: Point[], viewPoint: Point, height: number): Point[] {
    const heightCoefficient = 0.5;
    return basePoints.map(p => getFake3dPoint(p, viewPoint, height * heightCoefficient));
  }

  private createCeilingPolygon(topPoints: Point[]): Polygon {
    return new Polygon(topPoints);
  }

  private createSidePolygons(basePoints: Point[], topPoints: Point[]): Polygon[] {
    return basePoints.map((point, i) => {
      const nextIndex = (i + 1) % basePoints.length;
      return new Polygon([
        basePoints[i], basePoints[nextIndex],
        topPoints[nextIndex], topPoints[i]
      ]);
    }).sort(
        (a, b) =>
          this.getMinPointOfPolygonDistanceToPoint(b, this.viewPort.getViewPoint()) -
          this.getMinPointOfPolygonDistanceToPoint(a, this.viewPort.getViewPoint())
    );
  }

  private createRoofPolygons(ceiling: Polygon, basePoints: Point[], height: number, viewPoint: Point): Polygon[] {
    const baseMidpoints = [
      average(basePoints[0], basePoints[1]),
      average(basePoints[2], basePoints[3])
    ];

    const topMidpoints = baseMidpoints.map(p => getFake3dPoint(p, viewPoint, height));

    return [
      new Polygon([ceiling.points[0], ceiling.points[3], topMidpoints[1], topMidpoints[0]]),
      new Polygon([ceiling.points[2], ceiling.points[1], topMidpoints[0], topMidpoints[1]])
    ].sort(
      (a, b) =>
        this.getMinPointOfPolygonDistanceToPoint(b, this.viewPort.getViewPoint()) -
        this.getMinPointOfPolygonDistanceToPoint(a, this.viewPort.getViewPoint())
  );
  }

  private renderBase(basePoints: Point[]): void {
    this.polygonRenderer.render(new Polygon(basePoints), { fill: "white", stroke: "transparent", lineWidth: 1 });
  }

  private renderSides(sides: Polygon[]): void {
    sides.forEach(side => this.polygonRenderer.render(side, { fill: "white", stroke: "#4682B4", lineWidth:1 }));
  }

  private renderCeiling(ceiling: Polygon): void {
    this.polygonRenderer.render(ceiling, { fill: "white", stroke: "white", lineWidth: 1 });
  }

  private renderRoof(roofPolys: Polygon[], roofColor: string): void {
    roofPolys.forEach(poly => this.polygonRenderer.render(poly, { fill: roofColor, stroke: "#4682B4", lineWidth: 1, join: "round" }));
  }

  private getMinPointOfPolygonDistanceToPoint(polygon: Polygon, point: Point): number {
    return Math.min(...polygon.points.map(p => distance(p, point)));
  }
}
