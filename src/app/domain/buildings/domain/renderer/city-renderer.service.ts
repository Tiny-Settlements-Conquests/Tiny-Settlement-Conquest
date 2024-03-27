import { Point } from "../../../primitives/classes/Point";
import { Polygon } from "../../../primitives/classes/Polygon";
import { add, distance, subtract } from "../../../primitives/functions/util";
import { Viewport } from "../../../viewport/classes/viewport";
import { TownRendererService } from "./town-renderer.service";

interface HouseConfig {
  centerPoint: Point,
  color: string,
  houseHeight: number,
  houseSize: number
}

export class CityRendererService {

  constructor(
    private townRenderer: TownRendererService,
    private readonly viewPort: Viewport
  ) { }

  
  public render(centerPoint: Point, color: string) {
    const houseConfigs: HouseConfig[] = [
        {
        centerPoint, 
        color,
        houseHeight: 40,
        houseSize: 8
        },
        {
        centerPoint: add(centerPoint, new Point(20, -5)), 
        color,
        houseHeight: 40,
        houseSize: 8
        },
        {
        centerPoint: subtract(centerPoint, new Point(20,5)), 
        color,
        houseHeight: 40,
        houseSize: 8
        }
    ];
    this.sortHouses(houseConfigs).forEach((house) => {
      this.townRenderer.render(
        house.centerPoint,
        house.color,
        {
          houseHeight: house.houseHeight,
          houseSize: house.houseSize
        }
      );
    });
  }

  private sortHouses(houseConfig: HouseConfig[]) {
    return houseConfig.sort(
      (a, b) =>
      distance(b.centerPoint, this.viewPort.getViewPoint()) -
      distance(a.centerPoint, this.viewPort.getViewPoint())
  );
  }

}
