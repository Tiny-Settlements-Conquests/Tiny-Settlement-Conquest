import { ResourceInventory } from "../../../inventory/domain/classes/resource-inventory";
import { Resources } from "../models/resources.model";

export function transferResourcesBetween(options: {
    inventoryA: ResourceInventory,
    inventoryB: ResourceInventory,
    resourcesOfPlayerA: Partial<Resources>,
}) {
    const { inventoryA, inventoryB, resourcesOfPlayerA} = options;
    if(!inventoryA.hasEnoughtResources(resourcesOfPlayerA)) throw new Error('You have not enought resources to transfer')

    Object.entries(resourcesOfPlayerA).forEach(([key, value]) => {
        inventoryA.removeFromInventory(key as keyof Resources, value);
        inventoryB.addToInventory(key as keyof Resources, value);
    });
}

export function sumResources(resources: Partial<Resources>) {
    return Object.values(resources).reduce((sum, count) => sum + count, 0);
}

export function excludeEmptyResources(resources: Partial<Resources>): Partial<Resources> {
    return Object.keys(resources)
       .filter((key) => resources[key as keyof Resources] ?? 0 > 0)
       .reduce((result, key) => ({...result, [key]: resources[key as keyof Resources]}), {} as Resources);
}

export function getRandomResources(resources: Partial<Resources>, count: number): Partial<Resources> {
    const result: Partial<Resources> = {};
    const keys = Object.keys(resources) as (keyof Resources)[];
  
    while (count > 0 && keys.length > 0) {
      // Wähle eine zufällige Ressource aus
      const randomIndex = Math.floor(Math.random() * keys.length);
      const randomKey = keys[randomIndex];
      const maxAvailable = resources[randomKey] ?? 0;
  
      // Wenn die verfügbare Menge 0 ist, überspringen
      if (maxAvailable === 0) {
        keys.splice(randomIndex, 1);
        continue;
      }
  
      // Wähle eine zufällige Menge zwischen 1 und der verfügbaren Menge oder dem verbleibenden Count
      const randomAmount = Math.min(maxAvailable, count);
  
      // Update das Ergebnis und reduziere den Count
      result[randomKey] = (result[randomKey] ?? 0) + randomAmount;
      count -= randomAmount;
    }
  
    return result;
  }