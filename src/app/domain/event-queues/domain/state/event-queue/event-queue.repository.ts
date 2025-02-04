import { Injectable } from "@angular/core";
import { createStore } from "@ngneat/elf";
import { addEntities, selectLast, withEntities } from "@ngneat/elf-entities";
import { EventQueueItem } from "../../../domain/models/event-queue.model";
import { BaseQueueRepository } from "../queue.repository.abstract";

/**
 * reflects the events that have been dispatched accross the frontend e.g. opening a trade
 */
const eventQueueStore = createStore(
    { name: 'event-queue' },
    withEntities<EventQueueItem>()
);

@Injectable({
    providedIn: 'root'
})
export class EventQueueRepository extends BaseQueueRepository<typeof eventQueueStore>{
    protected readonly store = eventQueueStore;
}