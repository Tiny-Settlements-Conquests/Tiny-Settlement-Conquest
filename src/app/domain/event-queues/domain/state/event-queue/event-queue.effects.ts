import { inject, Injectable } from "@angular/core";
import { QueueEffects } from "../queue.effects.abstract";
import { EventQueueActions } from "./event-queue.actions";
import { EventQueueRepository } from "./event-queue.repository";

@Injectable({
    providedIn: 'root'
})
export class EventQueueEffects extends QueueEffects{
    protected readonly publishType = EventQueueActions.publish;
    protected readonly repository = inject(EventQueueRepository);
}