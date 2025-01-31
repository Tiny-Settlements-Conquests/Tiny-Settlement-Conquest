import { Injectable, inject } from "@angular/core";
import { DiceRepository } from "./dice.repository";
import { createEffect, ofType } from "@ngneat/effects";
import { DiceActions } from "./dice.actions";
import { tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DiceEffects {
    protected readonly repository = inject(DiceRepository);

    public resetDices = createEffect((actions) =>
        actions.pipe(
            ofType(DiceActions.resetDices),
            tap(() => {
                this.repository.resetDices();
            })
        )
    )

    public updateDiceOverlayOpenState = createEffect((actions) =>
        actions.pipe(
            ofType(DiceActions.updateDiceOverlayOpenState),
            tap(({isOpen}) => {
                this.repository.setIsOpen(isOpen);
            })
        )
    )

    public setDices = createEffect((actions) =>
        actions.pipe(
            ofType(DiceActions.setDices),
            tap(({dices}) => {
                this.repository.setDices(dices);
            })
        )
    )
}