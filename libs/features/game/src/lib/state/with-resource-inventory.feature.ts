import { untracked } from '@angular/core';
import { signalStoreFeature, withMethods, withState, patchState } from '@ngrx/signals';
import { Resources, ResourceType } from '@catan/shared/models';

/** Default empty resources */
const emptyResources: Resources = {
  bricks: 0,
  stone: 0,
  straw: 0,
  wood: 0,
  wool: 0,
};

export interface ResourceInventoryState {
  resources: Resources;
}

/**
 * Shared Signal Store Feature for resource inventory management.
 * Used by both InventoryStore (player) and BankStore (bank) to avoid code duplication.
 */
export function withResourceInventory(initial: Resources = emptyResources) {
  return signalStoreFeature(
    withState<ResourceInventoryState>({ resources: initial }),
    withMethods((store) => ({
      setResources(resources: Resources): void {
        patchState(store, { resources });
      },
      updateResourceAmount(resourceType: ResourceType, amount: number): void {
        const current = { ...untracked(() => store.resources()) };
        patchState(store, {
          resources: { ...current, [resourceType]: amount },
        });
      },
      updateRelativeResourceAmount(resourceType: ResourceType, delta: number): void {
        const current = { ...untracked(() => store.resources()) };
        patchState(store, {
          resources: { ...current, [resourceType]: current[resourceType] + delta },
        });
      },
    }))
  );
}
