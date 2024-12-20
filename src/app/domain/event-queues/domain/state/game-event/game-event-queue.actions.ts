import { createAction, props } from "@ngneat/effects";
import { EventItem } from "../../models/event-queue.model";

export class GameEventQueueActions {
    public static readonly publish = createAction('[gameEventQueue Store] publish event', props<EventItem>());
}