import { Injectable } from "@angular/core";
import { createStore } from "@ngneat/elf";
import { withEntities } from "@ngneat/elf-entities";
import { EventQueueItem } from "../../../domain/models/event-queue.model";
import { BaseQueueRepository } from "../queue.repository.abstract";

/**
 * reflects the events provided by the game core itself e.g. a new round has started
 */
const gameEventQueueStore = createStore(
    { name: 'game-event-queue' },
    withEntities<EventQueueItem>()
);

@Injectable({
    providedIn: 'root'
})
export class GameEventQueueRepository extends BaseQueueRepository<typeof gameEventQueueStore>{
    protected readonly store = gameEventQueueStore;
}