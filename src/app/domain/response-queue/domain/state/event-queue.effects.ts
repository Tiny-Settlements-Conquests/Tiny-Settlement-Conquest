import { inject, Injectable } from "@angular/core";
import { EventQueueRepository } from "./event-queue.repository";
import { createEffect, ofType } from "@ngneat/effects";
import { EventQueueActions } from "./event-queue.actions";
import { tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EventQueueEffects {
    private readonly _gateway = inject(EventQueueRepository);

    public publish = createEffect((actions) =>
        actions.pipe(
            ofType(EventQueueActions.publish),
            tap(({eventType, data}) => {
                console.log("TYPE");
                this._gateway.addResponse({
                    id: Math.random().toString(),
                    type: eventType,
                    data
                });
            })
        )
    )
}