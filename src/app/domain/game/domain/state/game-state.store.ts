import { patchState, signalStore, withMethods, withState } from "@ngrx/signals"
import { GAME_STATE } from "../models/game-state.model"


type GameStateState = {
    state: GAME_STATE
}

const initialState: GameStateState = {
    state: GAME_STATE.PLAY
}

export const GameStateStore = signalStore(
    withState(initialState),
    withMethods((store) => ({
        setMode(state: GAME_STATE) {
            patchState(store, {
                state
            })
        }
    }))
)