import { BehaviorSubject } from "rxjs";
import { GAME_STATE } from "../models/game-state.model";

export class GameStateController {
    private readonly _gameState = new BehaviorSubject<GAME_STATE>(GAME_STATE.PLAY);
    
}