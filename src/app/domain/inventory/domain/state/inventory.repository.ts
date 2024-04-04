import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';
import { map } from 'rxjs';
import { ResourceType } from '../../../resources/models/resource-field.model';
import { Inventory } from '../models/inventory.model';

const inventoryStore = createStore(
    { name: 'inventory' },
    withProps<Inventory>({
        bricks:0,
        stone: 0,
        straw: 0,
        wood: 0,
        wool: 0
    })
);

@Injectable(
  { providedIn: 'root' }
)
export class InventoryRepository {

  public updateResourceAmount(resourceType: ResourceType, amount: number) {
    inventoryStore.update(state => ({ ...state, [resourceType]: amount }));
  }

  public setResources(resources: Inventory) {
    inventoryStore.update(state => ({...state,...resources }));
  }

  public selectInventory() {
    return inventoryStore.pipe()
  }

  public getMode() {
    return inventoryStore.query(state => state);
  }
}
