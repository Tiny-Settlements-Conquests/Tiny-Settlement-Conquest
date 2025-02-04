import { untracked } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { Resources, ResourceType } from "../../../resources/domain/models/resources.model";

type BankState = {
    resources: Resources;
};
  
const initialState: BankState = {
    resources: {
        bricks:0,
        stone: 0,
        straw: 0,
        wood: 0,
        wool: 0
    },
};

export const BankStore = signalStore(
    withState(initialState),
    withMethods((store) => ({
        setResources(resources: Resources) {
            patchState(store, {
                resources
            })
        },
        updateResourceAmount(resourceType: ResourceType, amount: number) {
            const oldState = {...untracked(() => store.resources())};
            patchState(store, {
                resources: {...oldState, [resourceType]: amount}
            })
        },
        updateRelativeResourceAmount(resourceType: ResourceType, resourceAmount: number) {
            const oldState = {...untracked(() => store.resources())};
            patchState(store, {
                resources: {...oldState, [resourceType]: oldState[resourceType] += resourceAmount}
            })
        }
    }))
);