import { Injectable, inject } from '@angular/core';
import { createEffect, ofType } from '@ngneat/effects';
import { tap } from 'rxjs';
import { RoundPlayerActions } from './round-player.actions';
import { RoundPlayerRepository } from './round-players.repository';

@Injectable({
    providedIn: 'root'
})
export class RoundPlayerEffects {
    private readonly repository = inject(RoundPlayerRepository);

    public readonly setRoundPlayers = createEffect((actions) =>
        actions.pipe(
            ofType(RoundPlayerActions.setRoundPlayers),
            tap(({players}) => {
                console.log("PDWPWDP", players)

                this.repository.setRoundPlayers(players)
            })
        )
    )

    public readonly setWinningPointsForPlayer = createEffect((actions) =>
        actions.pipe(
            ofType(RoundPlayerActions.setWinningPointsForPlayer),
            tap(({amount, playerId}) => {
                this.repository.setWinningPointsForPlayer(amount, playerId);
            })
        )
    )

    public readonly updateActiveRoundPlayer = createEffect((actions) =>
        actions.pipe(
            ofType(RoundPlayerActions.updateActiveRoundPlayer),
            tap(({playerId}) => {
                this.repository.updateActiveRoundPlayer(playerId);
            })
        )
    )
    
}