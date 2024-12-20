import { InjectionToken, Provider } from "@angular/core"
import { Edition, ENVIRONMENT } from "../../../../../env/environment";
import { GameEventDispatcherService } from "../../services/game-event-dispatcher.service";
import { GameEventWsDispatcherService } from "../../services/game-event-ws-dispatcher.service";
import { GameEventDispatcher } from "../models/game-event-dispatcher.model";

export const GAME_EVENT_DISPATCHER = new InjectionToken<GameEventDispatcher>('game_event_dispatcher');

export function provideGameEventDispatcher(): Provider {
    return {
        provide: GAME_EVENT_DISPATCHER,
        useClass: ENVIRONMENT.edition === Edition.SINGLEPLAYER ? GameEventDispatcherService : GameEventWsDispatcherService
    }
}