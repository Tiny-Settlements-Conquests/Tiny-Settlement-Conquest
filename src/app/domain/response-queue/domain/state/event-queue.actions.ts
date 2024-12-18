
import { createAction, props } from '@ngneat/effects';
import { EventItem } from '../models/event-queue.model';

export class EventQueueActions {
    public static readonly publish = createAction('[eventQueue Store] publish event', props<EventItem>());
}