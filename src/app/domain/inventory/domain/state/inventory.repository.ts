import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';
import { map } from 'rxjs';
import { ResourceType } from '../../../resources/models/resource-field.model';
import { Inventory } from '../models/inventory.model';

const inventoryStore = createStore(
    { name: 'inventory' },
    withProps<Inventory>({
        bricks:1,
        stone: 3,
        straw: 2,
        wood: 10,
        wool: 2
    })
);

@Injectable(
  { providedIn: 'root' }
)
export class InventoryRepository {

  public updateResourceAmount(resourceType: ResourceType, amount: number) {
    inventoryStore.update(state => ({ ...state, [resourceType]: amount }));
  }

  public selectInventory() {
    return inventoryStore.pipe()
  }

  public getMode() {
    return inventoryStore.query(state => state);
  }
}
