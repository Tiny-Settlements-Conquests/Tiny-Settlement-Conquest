import { Injectable } from "@angular/core";
import { createStore, withProps } from "@ngneat/elf";
import { Dices } from "../models/dice.model";


const diceStore = createStore(
    { name: 'bank' },
    withProps<Dices | undefined>([
        1, 1
    ])
);

@Injectable({
    providedIn: 'root'
})
export class DiceRepository {
    public resetDices() {
        diceStore.update(_ => (undefined))
    }

    public selectDices() {
        return diceStore.pipe()
    }

    public getDices() {
        return diceStore.query(state => state);
    }

    public setDices(dices: Dices) {
        diceStore.update(state => (dices ));
    }
}