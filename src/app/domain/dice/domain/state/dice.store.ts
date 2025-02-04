import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { Dices } from "../models/dice.model";
import { effect } from "@angular/core";

type DiceState = {
    dices: Dices | undefined;
    isOverlayOpen: boolean;
};
  
const initialState: DiceState = {
    dices: undefined,
    isOverlayOpen: false,
};

export const DiceStore = signalStore(
    withState(initialState),
    withMethods((store) => ({
        setDices(dices: Dices | undefined): void {
            patchState(store, {
                dices
            });
        },
        setIsOverlayOpen(isOverlayOpen: boolean): void {
            patchState(store, {
                isOverlayOpen
            })
        }
    })),
    withHooks((store) => ({
        onInit() {
            effect(() => {
                const dices = store.dices;
                if(dices === undefined) {
                    store.setIsOverlayOpen(false);
                }
            })
        },
    }))
);