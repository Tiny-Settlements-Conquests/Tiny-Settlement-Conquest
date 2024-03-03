import { GraphNode } from "../../../graph/domain/classes/graph-node";
import { Player } from "../../../player/domain/classes/player";
import { Point } from "../../../primitives/classes/Point";
import { Building, BuildingType } from "../models/building.model";

export class GraphBuildingNode extends GraphNode {
  public constructor(
    id: string,
    position: Point,
    private readonly _player: Player,
  ) {
    super(id, position)
  }

  public get player(): Player {
    return this._player
  }

  private _buildingType: BuildingType | null = null;

  public hasBuilding(): boolean {
    return this._buildingType !== null;
  }

  public get buildingType(): BuildingType | null {
    return this._buildingType;
  }

  public tryBuild(building: BuildingType) {
    if(this.buildingType) throw new Error('already has a building');
    this._buildingType = building;
  }
}
