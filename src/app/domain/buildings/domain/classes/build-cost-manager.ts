import { Inventory } from "../../../inventory/domain/models/inventory.model";

import { Player } from "../../../player/domain/classes/player";
import { ResourceType } from "../../../resources/models/resource-field.model";
import { BuildingType } from "../models/building.model";
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
      }
    }
  ) { }

  public tryIfBuildingCanBeBuild(player: Player, buildingType: BuildingType | 'road'): boolean {
    try {
      const inventory = player.resourceInventory.resources;
      if(!this.checkIfHasEnoughResources(inventory, this.buildingCosts[buildingType])) throw new Error('has not enought resources');
    } catch(e) {
      throw new Error('Not enough resources');
    }
    return true;
  }

  public removeResourcesByBuilding(player: Player, buildingType: BuildingType | 'road') {
    this.tryIfBuildingCanBeBuild(player, buildingType);
    this.removeResources(player, this.buildingCosts[buildingType])
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


  private removeResources(player: Player, resources: Partial<Inventory>) {
    Object.entries(resources).forEach(([key, value]) => {
      player.resourceInventory.removeFromInventory(key as ResourceType, value);
      this.bank.addToInventory(key as ResourceType, value);
    })
  }

}
