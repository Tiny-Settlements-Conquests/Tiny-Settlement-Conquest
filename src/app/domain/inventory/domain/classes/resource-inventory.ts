import { Resource } from "../../../resources/domain/classes/fields/resource-field";
import { Resources } from "../../../resources/domain/models/resources.model";
import { Inventory } from "./inventory";

export class ResourceInventory extends Inventory<Resources>{

  constructor(_resources = {
    straw: 0,
    stone: 0,
    wool: 0,
    bricks: 0,
    wood: 0
  }) {
    super(_resources);
  }

  public get resources() {
    return this._inventory.value;
  }

  public get amount() {
    return Object.values(this._inventory.value).reduce((a, b) => a + b, 0);
  }

  public getNotEmptyResources(): Resources {
    const resources = this._inventory.value;
    return Object.keys(resources).reduce((result, key) => {
      if (resources[key as keyof Resources] > 0) {
        return {
          ...result,
          [key]: resources[key as keyof Resources],
        };
      }
      return result;
    }, {} as Resources);
  }

  public hasEnoughtResources(resources: Partial<Resources>): boolean {
    return Object.keys(resources).reduce((p, key) => {
      const resource = resources[key as keyof Resources] ?? 0;
      const inventoryResource = this._inventory.value[key as keyof Resources];
      return inventoryResource >= resource && p}, true
    )
  }

  /**
   * compares the given resources with the current inventory and returns the difference between them
   */
  public getResourceDifference(resources: Partial<Resources>): Partial<Resources> {
    return Object.keys(resources).reduce((acc, key) => {
      const required = resources[key as keyof Resources] as number; // Benötigte Ressourcenmenge
      const current = this._inventory.value[key as keyof Resources] ?? 0; // Aktueller Bestand im Inventar
      const difference = required - current;
  
      // Nur hinzufügen, wenn die Differenz positiv ist (d.h. es fehlen Ressourcen)
      if (difference > 0) {
        acc[key as keyof Resources] = difference;
      }
  
      return acc;
    }, {} as Partial<Resources>);
  }

  public getResourcesExclude(resources: Partial<Resources>): Partial<Resources> {
    return Object.keys(this._inventory.value).reduce((acc, key) => {
      // Wenn der Schlüssel nicht in den übergebenen `resources` enthalten ist, fügen wir ihn dem Ergebnis hinzu
      if (!(key in resources)) {
        acc[key as keyof Resources] = this._inventory.value[key as keyof Resources];
      }
      return acc;
    }, {} as Partial<Resources>);
  }
}