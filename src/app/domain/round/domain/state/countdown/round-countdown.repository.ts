import { Injectable } from "@angular/core";
import { createStore, withProps } from "@ngneat/elf";
import { withEntities, withActiveId } from "@ngneat/elf-entities";
import { RoundPlayer } from "../../models/round-player.model";
import { combineLatest, filter, map, switchMap, takeUntil } from "rxjs";
import { RoundCountdown } from "../../models/round-countdown.model";

const roundCountdownStore = createStore(
    { name: 'roundcountdown' },
    withProps<RoundCountdown>({
        countdown: 0,
    }),
);

@Injectable({
    providedIn: 'root'
})
export class RoundCountdownRepository {
    public setRoundTimers({countdown} = {countdown: 0}) {
        roundCountdownStore.update((state) => ({countdown}))
    }

    public selectCountdownMiliseconds() {
        return roundCountdownStore.pipe(map((state) => state.countdown))
    }


    public selectCountdownEnd() {
        return this.selectCountdownMiliseconds().pipe(
            filter((m) => m <= 0)
        )
    }
}