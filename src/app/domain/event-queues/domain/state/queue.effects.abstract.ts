import { createEffect, ofType } from "@ngneat/effects";
import { tap } from "rxjs";
import { BaseQueueRepository } from "./queue.repository.abstract";
import { EventQueueActions } from "./event-queue/event-queue.actions";

export type PublishTypes = typeof EventQueueActions.publish; // | another publish queue

export abstract class QueueEffects {
    protected abstract readonly publishType: PublishTypes;
    protected abstract readonly repository: BaseQueueRepository;

    public readonly publish = createEffect((actions) =>
        actions.pipe(
            ofType(this.publishType),
            tap(({eventType, data}) => {
                this.repository.addResponse({
                    id: Math.random().toString(),
                    type: eventType,
                    data
                });
            })
        )
    )
}