import { Injectable } from "@angular/core";
import { createStore } from "@ngneat/elf";
import { addEntities, deleteAllEntities, selectAllEntities, selectLast, withEntities } from "@ngneat/elf-entities";
import { ResponseQueueItem } from "../models/response-queue.model";
import { tap } from "rxjs";

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

    public selectLatestResponse() {
        return tradeStore.pipe(
            selectLast(),
        )
    }
}