import { Graph } from "../../../graph/domain/classes/graph";
import { Inventory } from "../../../inventory/domain/classes/inventory";
import { RoundPlayer } from "../../../round/domain/models/round-player.model";

export interface User {
  id: string;
  name: string;
  profileUrl: string;
}

export class Player {
  constructor(
    private readonly _roundPlayer: RoundPlayer,
    private readonly _inventory: Inventory,
    private readonly _buildingGraph: Graph
  ) { }
  
  public get id() {
    return this._roundPlayer.id;
  }

  public get roundPlayer(): RoundPlayer {
    return this._roundPlayer;
  }

  public get buildingGraph(): Graph {
    return this._buildingGraph;
  }

  public get inventory(): Inventory {
    return this._inventory
  }

  public get color(): string {
    return this._roundPlayer.color;
  }

}
