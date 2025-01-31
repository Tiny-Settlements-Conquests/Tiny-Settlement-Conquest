import { Injectable } from "@angular/core";
import { createStore, withProps } from "@ngneat/elf";
import { Dices } from "../models/dice.model";
import { distinctUntilChanged, filter, map, Observable, Subject } from "rxjs";
import { isEqual } from "lodash";

interface DiceStoreState {
    isOpen: boolean;
    dices: Dices | undefined
}

const diceStore = createStore(
    { name: 'dice' },
    withProps<DiceStoreState>({
        isOpen: false,
        dices: [1, 1]
    })
);

@Injectable({
    providedIn: 'root'
})
export class DiceRepository {
    public readonly diceRollStart = new Subject();

    public selectResetDices(): Observable<boolean> {
        return diceStore.pipe(
            distinctUntilChanged(isEqual),
            filter(({dices}) => dices === undefined),
            map(state => {
                return true
            })
        );
    }
    public resetDices() {
        diceStore.update(state => ({...state, dices: undefined}))
    }

    public selectDices() {
        return diceStore.pipe(
            map((state) => state.dices),
            distinctUntilChanged(isEqual),
        )
    }

    public getDices() {
        return diceStore.query(state => state);
    }

    public setDices(dices: Dices) {
        diceStore.update(state => ({...state, dices} ));
    }

    public selectIsOpen(): Observable<boolean> {
        return diceStore.pipe(
            map((state) => state.isOpen),
            distinctUntilChanged(isEqual),
        );
    }

    public setIsOpen(isOpen: boolean) {
        return diceStore.update(state => ({...state, isOpen}));
    }

}