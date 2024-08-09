import { Injectable } from "@angular/core";
import { createStore } from "@ngneat/elf";
import { addEntities, selectAllEntities, withEntities } from "@ngneat/elf-entities";
import { ResponseQueueItem } from "../models/response-queue.model";

const tradeStore = createStore(
    { name: 'response-queue' },
    withEntities<ResponseQueueItem>()
);

@Injectable({
    providedIn: 'root'
})
export class ResponseQueueRepository {
    public addResponse(response: ResponseQueueItem) {
        tradeStore.update(addEntities([response]));
    }

    public selectAllResponses() {
        return tradeStore.pipe(
            selectAllEntities()
        )
    }
}