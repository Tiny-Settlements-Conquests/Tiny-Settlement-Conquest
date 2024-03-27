import { Inventory } from "../../../inventory/domain/models/inventory.model";
import { Player } from "../../../player/domain/classes/player";
import { BuildingType } from "../models/building.model";

export class BuildCostManager {

  constructor() { }

  public tryBuild(player: Player, buildingType: 'road' | 'city' | 'town') {
    try {
      const inventory = player.inventory.resources;
      switch (buildingType) {
        case 'city': 
          const cityResourceCost: Partial<Inventory> = {
            stone: 2,
            straw: 3
          }
          this.checkIfHasEnoughResources(inventory, cityResourceCost);
          this.removeResources(inventory, cityResourceCost);

         break;
        case 'town':
          const townResourceCost: Partial<Inventory> = {
            wood: 1,
            straw: 1,
            bricks: 1,
            wool: 1
          }
          this.checkIfHasEnoughResources(inventory, townResourceCost);
          this.removeResources(inventory, townResourceCost);

          break;
        case 'road':
          const roadResourceCost: Partial<Inventory> = {
            wood: 1,
            bricks: 1
          }
          this.checkIfHasEnoughResources(inventory, roadResourceCost);
          this.removeResources(inventory, roadResourceCost);
          break;
      }
    } catch(e) {
      console.log("not enough resources");
      throw new Error()
    }
  }

  private checkIfHasEnoughResources(inventory: Inventory, resources: Partial<Inventory>) {
    Object.entries(resources).forEach(([key, value]) => {
      if (typeof inventory[key as keyof Inventory] !== 'undefined') {
        if (inventory[key as keyof Inventory] < value) {
          console.log(value, key);
          throw new Error('Not enough resources');
        }
      }
    })
  }

  private removeResources(inventory: Inventory, resources: Partial<Inventory>) {
    Object.entries(resources).forEach(([key, value]) => {
      if (typeof inventory[key as keyof Inventory] !== 'undefined') {
        inventory[key as keyof Inventory] -= value;
      }
    })
  }

}
