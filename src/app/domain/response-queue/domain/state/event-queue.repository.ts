import { Injectable } from "@angular/core";
import { createStore } from "@ngneat/elf";
import { addEntities, selectLast, withEntities } from "@ngneat/elf-entities";
import { ResponseQueueItem } from "../models/event-queue.model";

const tradeStore = createStore(
    { name: 'event-queue' },
    withEntities<ResponseQueueItem>()
);

@Injectable({
    providedIn: 'root'
})
export class EventQueueRepository {
    public addResponse(response: ResponseQueueItem) {
        tradeStore.update(addEntities([response]));
    }

    public selectLatestResponse() {
        return tradeStore.pipe(
            selectLast(),
        )
    }
}