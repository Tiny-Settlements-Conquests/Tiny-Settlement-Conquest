import { Store } from "@ngneat/elf";
import { addEntities, selectLast } from "@ngneat/elf-entities";
import { EventQueueItem } from "../models/event-queue.model";
import { Observable } from "rxjs";

export abstract class BaseQueueRepository<StoreType extends Store = Store> {
    protected readonly abstract store: StoreType;
    
    public addResponse(response: EventQueueItem) {
        this.store.update(addEntities([response]));
    }

    public selectLatestResponse(): Observable<EventQueueItem> {
        return this.store.pipe(
            selectLast(),
        )
    }
}