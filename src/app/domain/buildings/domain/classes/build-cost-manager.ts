import { Inventory } from "../../../inventory/domain/models/inventory.model";

import { Player } from "../../../player/domain/classes/player";
import { ResourceType } from "../../../resources/domain/models/resource-field.model";
import { Buildable, BuildingTyp, BuildingType, PathType, PlaceableType } from "../models/building.model";
import { ResourceInventory } from "../../../inventory/domain/classes/resource-inventory";

export class BuildCostManager {

  constructor(
    private bank: ResourceInventory,
    public readonly buildingCosts = {
      city: {
        stone: 2,
        straw: 3
      },
      town: {
        wood: 1,
        straw: 1,
        bricks: 1,
        wool: 1
      },
      road: {
        wood: 1,
        bricks: 1
      },
      seaPath: {
        wood: 1,
        bricks: 1
      }
    }
  ) { }

  public hasPlayerEnoughtResources(player: Player, type: PlaceableType): boolean {
    const inventory = player.resourceInventory.resources;
    return this.checkIfHasEnoughResources(inventory, this.buildingCosts[type]);
  }

  private checkIfHasEnoughResources(inventory: Inventory, resources: Partial<Inventory>): boolean {
    let hasEnough = true;
    Object.entries(resources).forEach(([key, value]) => {
      if (inventory[key as keyof Inventory] < value) {
        hasEnough = false;
      }
    })
    return hasEnough;
  }

  public removeResourcesByBuilding(player: Player, type: PlaceableType) {
    if(!this.hasPlayerEnoughtResources(player, type)) throw new Error('not enough resources');
    this.removeResources(player, this.buildingCosts[type])
  } 

  private removeResources(player: Player, resources: Partial<Inventory>) {
    Object.entries(resources).forEach(([key, value]) => {
      player.resourceInventory.removeFromInventory(key as ResourceType, value);
      this.bank.addToInventory(key as ResourceType, value);
    })
  }

}
