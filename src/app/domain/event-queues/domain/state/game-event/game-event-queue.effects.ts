import { Injectable, inject } from "@angular/core";
import { QueueEffects } from "../queue.effects.abstract";
import { GameEventQueueActions } from "./game-event-queue.actions";
import { GameEventQueueRepository } from "./game-event-queue.repository";

@Injectable({
    providedIn: 'root'
})
export class GameEventQueueEffects extends QueueEffects{
    protected readonly publishType = GameEventQueueActions.publish;
    protected readonly repository = inject(GameEventQueueRepository);
}