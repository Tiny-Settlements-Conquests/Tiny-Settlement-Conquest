import { computed, effect, untracked } from "@angular/core";
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { BehaviorSubject, interval, pipe, Subscription, switchMap, tap } from "rxjs";
import { timeMapper } from "../../../../countdown/domain/operators/time-mapper.operator";

type RoundCountdownState = {
    countdownInMS: number;
    _intervalRef: BehaviorSubject<Subscription | undefined>
};
  
const initialState: RoundCountdownState = {
    countdownInMS: 0,
    _intervalRef: new BehaviorSubject<Subscription | undefined>(undefined)
};

export const RoundCountdownStore = signalStore(
    withState(initialState),
     withComputed((store) => ({
        isCountdownEnded: computed(() => {
            return store.countdownInMS() <= 0
        })
    })),
    withMethods((store) => ({
        stopCountdown() {
            const _intervalRef = untracked(() => store._intervalRef());
            if(_intervalRef.value !== undefined) {
                _intervalRef.value.unsubscribe()
            }
        }
    })),
    withMethods((store) => ({
        setRoundTimers(countdownInMS: number) {
            patchState(store, {
                countdownInMS
            })
        },
        _resetCountdown() {
            store.stopCountdown();
            patchState(store, { countdownInMS: 0 });
        }
        
    })),
    withMethods((store) => ({
        startCountdown(countdownInMS: number) {
                
            if(store._intervalRef.value !== undefined) {
                store._resetCountdown();
            }
            store.setRoundTimers(countdownInMS);
            const _originalIntervalRef = untracked(() => store._intervalRef());

            const intervalRef = interval(1000).pipe(
                timeMapper(countdownInMS),
                tap((countdown) => {
                    if(countdown <= 0 && _originalIntervalRef.value) {
                        store._resetCountdown()
                    }
                    store.setRoundTimers(countdown);
                })
            ).subscribe()
            _originalIntervalRef.next(intervalRef);
        },
    })),
    withHooks((store) => ({
        onInit() {
            effect(() => {
                const countdown = store.countdownInMS();
                const intervalRef = store._intervalRef();
                if(countdown <= 0 && intervalRef.value !== undefined) {
                    store._resetCountdown();
                }
            })
        },
    }))
);

// game sets mode
// client subscribes to mode
// if mode is stopped, update gameMode store and client stops timer
// if mode is started, update gameMode
// select timer (changes on gameMode update or if the round ends/starts) and start timer