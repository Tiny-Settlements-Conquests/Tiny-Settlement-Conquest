import { ResourceInventory } from "../../../inventory/domain/classes/resource-inventory";
import { Player } from "../../../player/domain/classes/player";
import { Resources } from "../../../resources/domain/models/resources.model";
import { transferResourcesBetween } from "../../../resources/domain/utils/resource.utils";
import { PlaceableType } from "../models/building.model";

export class BuildCostManager {

  constructor(
    private bank: ResourceInventory,
    public readonly buildingCosts = {
      city: {
        stone: 3,
        straw: 2
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

  private checkIfHasEnoughResources(inventory: Resources, resources: Partial<Resources>): boolean {
    let hasEnough = true;
    Object.entries(resources).forEach(([key, value]) => {
      if (inventory[key as keyof Resources] < value) {
        hasEnough = false;
      }
    });
    return hasEnough;
  }

  public removeResourcesByBuilding(player: Player, type: PlaceableType) {
    if(!this.hasPlayerEnoughtResources(player, type)) throw new Error('not enough resources');
    this.removeResources(player, this.buildingCosts[type])
  } 

  private removeResources(player: Player, resources: Partial<Resources>) {
    transferResourcesBetween({inventoryA: player.resourceInventory, inventoryB: this.bank, resourcesOfPlayerA: resources})
  }

}
