import { GraphNode } from "../../../graph/domain/classes/graph-node";
import { Player } from "../../../player/domain/classes/player";
import { Point } from "../../../primitives/classes/Point";
import { Building } from "../models/building.model";

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

  private _building: Building | null = null;

  public hasBuilding(): boolean {
    return this._building !== null;
  }

  public get building(): Building | null {
    return this._building;
  }

  removeBuilding() {
    this._building = null;
  }

  public tryBuild(building: Building) {
    if(this._building) throw new Error('already has a building');
    this._building = building;
  }
}
