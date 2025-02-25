import { switchMap, race, takeUntil, tap, Subject, filter, BehaviorSubject, combineLatest, merge } from "rxjs";
import { GAME_PHASE } from "../models/game-phase.model";
import { createStopableTimer, StoppableTimer } from "../utils/stopable-timer.utils";
import { GamePhaseController } from "./game-phase.class"
import { GameTimeController } from "./game-timer.class"

export class GameRoundController {
    public readonly _gameTimeController: GameTimeController
    public readonly _gamePhaseController: GamePhaseController
    
    public readonly _nextRoundNotifier = new Subject();

    public readonly _rollDiceNotifierOut: Subject<void> = new Subject(); // out
    public readonly _rollDiceByUserNotifierIn: Subject<void> = new Subject(); // in

    public readonly _updateCurrentTimerNotifier: BehaviorSubject<boolean> = new BehaviorSubject(true);

    private readonly _resetNotifier = new Subject();


    constructor(
      gameTimeController: GameTimeController,
      gamePhaseController: GamePhaseController
    ) {
        this._gameTimeController = gameTimeController;
        this._gamePhaseController = gamePhaseController;
        
        this._gamePhaseController.selectGamePhase().pipe(
        ).subscribe((phase) => {
          const watch = this._gameTimeController.setAndGetWatchByGamePhase(phase);
          this._resetNotifier.next(true);
          console.log("PHASE: ", phase)
          if(phase === GAME_PHASE.ROLL) {
            this.startRollTimer(watch);
          } else {
            this.startRoundTimer(watch);
          }
          this._updateCurrentTimerNotifier.next(true);
        })

        merge(
          this._rollDiceByUserNotifierIn,
          this._rollDiceNotifierOut
        ).pipe(
          // takeUntil(this._resetNotifier),
        ).subscribe(() => {
          this._gamePhaseController.updateGamePhase(GAME_PHASE.ROUND);
        })

        this._nextRoundNotifier.pipe(
          // takeUntil(this._resetNotifier),
        ).subscribe(() => {
          this._gamePhaseController.updateGamePhase(GAME_PHASE.ROLL);
          console.log("round end...")
        })

        
    }

    private startRollTimer(watch: StoppableTimer) {
      race(
        watch.display$,
        this._rollDiceByUserNotifierIn
      ).pipe(
        takeUntil(this._rollDiceByUserNotifierIn),
        takeUntil(this._nextRoundNotifier),
        takeUntil(this._resetNotifier),
      ).subscribe(() => {
        this._rollDiceNotifierOut.next();
      })
    }
  
    private startRoundTimer(watch: StoppableTimer) {
      watch.display$.pipe(
        takeUntil(this._resetNotifier),
        takeUntil(this._nextRoundNotifier),
      ).subscribe(() => {
        this._nextRoundNotifier.next(true);
      })
    }


} 