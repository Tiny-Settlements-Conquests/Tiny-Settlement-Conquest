import { BehaviorSubject, Observable, race, Subject, switchMap, takeUntil, tap } from "rxjs";
import { GAME_PHASE } from "../models/game-phase.model";

export class GamePhaseController  {
    private readonly _gamePhase = new BehaviorSubject<GAME_PHASE>(GAME_PHASE.ROLL);
    private readonly _nextRoundNotifier = new Subject();

    public selectGamePhase(): Observable<GAME_PHASE> {
      return this._gamePhase.asObservable();
    }
    
    updateGamePhase(gamePhase: GAME_PHASE) {
      const currentGamePhase = this._gamePhase.value;
      if(gamePhase === currentGamePhase) return;
      this._gamePhase.next(gamePhase);
      this._nextRoundNotifier.next(true);
    }
}