import { patchState, signalStore, withMethods } from "@ngrx/signals";
import { addEntity, withEntities } from "@ngrx/signals/entities";
import { HistoryAction } from "../models/action.model";


export const ActionHistoryStore = signalStore(
    withEntities<HistoryAction>(),
    withMethods((store) => ({
        addAction(action: HistoryAction) {
            patchState(store, addEntity(action));
        }
    }))
);