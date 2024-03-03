import { Graph } from "../../../graph/domain/classes/graph";
import { Inventory } from "../../../inventory/domain/classes/inventory";

interface User {
  id: string;
  name: string;
}

export class Player {
  private winningPoints: number = 0;

  constructor(
    private readonly _user: User,
    private readonly _color: string,
    private readonly _inventory: Inventory,
    private readonly _buildingGraph: Graph
  ) { }

  public get user(): User {
    return this._user;
  }

  public get buildingGraph(): Graph {
    return this._buildingGraph;
  }

  public get inventory(): Inventory {
    return this._inventory
  }

  public get color(): string {
    return this._color;
  }

}
