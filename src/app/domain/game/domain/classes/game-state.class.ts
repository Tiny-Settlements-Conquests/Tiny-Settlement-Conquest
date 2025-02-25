import { BehaviorSubject, Observable, Subject, takeUntil } from "rxjs";
import { GAME_STATE } from "../models/game-state.model";

export class GameStateController {
    private readonly _gameState = new BehaviorSubject<GAME_STATE>(GAME_STATE.PLAY);

    public selectGameState(): Observable<GAME_STATE> {
        return this._gameState.asObservable();
    }
    
    public readonly pauseNotifier = new Subject();
    public readonly resumeNotifier = new Subject();
    public readonly endNotifier = new Subject();

    constructor() {
        this._gameState.pipe(
            takeUntil(this.endNotifier)
        ).subscribe((state: GAME_STATE) => {
            switch(state) {
                case GAME_STATE.PLAY:
                    this.resumeNotifier.next(true);
                    break;
                case GAME_STATE.END:
                    this.endNotifier.next(true);
                    break;
                case GAME_STATE.PAUSE:
                    this.pauseNotifier.next(true);
                    break;
            }
        })
    }
    
    public updateGameState(gameState: GAME_STATE) {
        const currentGameState = this._gameState.value;
        if(gameState === currentGameState) return;
        this._gameState.next(gameState);
    }
}