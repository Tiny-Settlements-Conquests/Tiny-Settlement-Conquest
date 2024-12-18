import { Injectable } from "@angular/core";
import { createStore } from "@ngneat/elf";
import { addEntitiesFifo, selectAllEntities, withEntities } from "@ngneat/elf-entities";
import { HistoryAction } from "../models/action.model";



const actionHistoryStore = createStore(
    { name: 'action-history' },
    withEntities<HistoryAction>(),
);

@Injectable({
    providedIn: 'root'
})
export class ActionHistoryRepository {

    public selectAllActions() {
        return actionHistoryStore.pipe(
            selectAllEntities()
        )
    }

    public addAction(action: HistoryAction) {
        actionHistoryStore.update(addEntitiesFifo(action, { limit: 20 }));
    }

}