import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { GameMode } from "../models/game-mode.model";

type GameModeState = {
    mode: GameMode;
};
  
const initialState: GameModeState = {
    mode: "spectate",
};

export const GameModeStore = signalStore(
    withState(initialState),
    withMethods((store) => ({
        setMode(mode: GameMode) {
            patchState(store, {
                mode
            })
        }
    }))
);