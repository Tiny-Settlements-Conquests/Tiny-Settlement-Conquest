import { Injectable, inject } from "@angular/core";
import { createEffect, ofType } from "@ngneat/effects";
import { tap } from "rxjs";
import { GameModeActions } from "./game-mode.actions";
import { GameModeRepository } from "./game-mode.repository";

@Injectable({
    providedIn: 'root'
})
export class GameModeEffects {
    protected readonly repository = inject(GameModeRepository);

    public updateMode = createEffect((actions) =>
        actions.pipe(
            ofType(GameModeActions.updateMode),
            tap(({mode}) => {
                this.repository.updateMode(mode);
            })
        )
    )
}