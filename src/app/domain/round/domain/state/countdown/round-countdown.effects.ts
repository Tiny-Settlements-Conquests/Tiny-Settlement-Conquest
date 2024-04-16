import { Injectable, inject } from '@angular/core';
import { createEffect, ofType } from '@ngneat/effects';
import { BehaviorSubject, Subscription, interval, tap } from 'rxjs';
import { timeMapper } from '../../../../countdown/domain/operators/time-mapper.operator';
import { RoundCountdownActions } from './round-countdown.actions';
import { RoundCountdownRepository } from './round-countdown.repository';

@Injectable({
    providedIn: 'root'
})
export class RoundCountdownEffects {
  private readonly _roundCountdownRepository = inject(RoundCountdownRepository);
  private readonly intervalRef = new BehaviorSubject<Subscription | undefined>(undefined);

  public setRoundTimers$ = createEffect((actions) =>
      actions.pipe(
        ofType(RoundCountdownActions.setRoundCountdown),
        tap(({countdown}) => {
          this._roundCountdownRepository.setRoundTimers({countdown})
          if(this.intervalRef.value) {
            this.intervalRef.value.unsubscribe()
          }

          this.intervalRef.next(
            interval(1000).pipe(
              timeMapper(countdown),
              tap((countdown) => {
                console.log(countdown)
                if(countdown <= 0 && this.intervalRef.value) {
                  this.intervalRef.value.unsubscribe()
                }
                this._roundCountdownRepository.setRoundTimers({countdown})

              })
            ).subscribe()
          )
        })
      )
    )
    
}