import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';
import { ResourceType } from '../../../resources/domain/models/resource-field.model';
import { Inventory } from '../../../inventory/domain/models/inventory.model';

const bankStore = createStore(
    { name: 'bank' },
    withProps<Inventory>({
        bricks:25,
        stone: 20,
        straw: 25,
        wood: 10,
        wool: 25
    })
);

@Injectable(
  { providedIn: 'root' }
)
export class BankRepository {

  public updateResourceAmount(resourceType: ResourceType, amount: number) {
    bankStore.update((state) => ({ ...state, [resourceType]: (state[resourceType] + amount) }));
  }

  public selectInventory() {
    return bankStore.pipe()
  }

  public getInventory() {
    return bankStore.query(state => state);
  }

  public setInventory(inventory: Inventory) {
    bankStore.update(state => ({...inventory }));
  }
}
