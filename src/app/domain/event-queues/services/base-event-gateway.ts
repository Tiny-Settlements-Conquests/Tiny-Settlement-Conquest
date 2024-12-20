import { EventGateway } from "../domain/models/event-gateway.model";
import { EventQueueItem } from "../domain/models/event-queue.model";

export abstract class BaseEventGateway implements EventGateway {
    public abstract handle(event: EventQueueItem | undefined): void;
}