import { BuildingBuildManager } from "../../../../buildings/domain/classes/building-build-manager";
import { GameConfig } from "../../../../game/domain/models/game.model";
import { ResourceInventory } from "../../../../inventory/domain/classes/resource-inventory";
import { Playground } from "../../../../playground/domain/classes/playground";


export class ResourceDistributor {
  constructor(
    private readonly _playground: Playground,
    private readonly _buildingBuildManager: BuildingBuildManager,
    private readonly _bank: ResourceInventory,
    private readonly _resourceMultiplier: GameConfig['resourceMultiplier'] = 1
  ) {}

  public distributeResources(diceValue: number): void {
    const foundFields = this._playground.resourceFields.filter(
      (field) => field.value === diceValue
    );

    foundFields.forEach((field) => {
      field.field.polygon.points.forEach((p) => {
        try {
          const owner = this._buildingBuildManager.getOwnerOfBuildingByPoint(p);
          const amount = 1 * this._resourceMultiplier;

          if (this._bank.resources[field.typ] >= amount) {
            owner.resourceInventory.addToInventory(field.typ, amount);
            this._bank.removeFromInventory(field.typ, amount);
          }
        } catch (error) {}
      });
    });
  }
}