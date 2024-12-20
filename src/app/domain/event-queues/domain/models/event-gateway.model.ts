import { EventQueueItem } from "./event-queue.model";

export interface EventGateway {
    handle(event: EventQueueItem | undefined): void
}