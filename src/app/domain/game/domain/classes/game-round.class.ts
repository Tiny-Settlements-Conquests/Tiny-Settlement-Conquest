import { switchMap, race, takeUntil, tap, Subject } from "rxjs";
import { GAME_PHASE } from "../models/game-phase.model";
import { createStopableTimer } from "../utils/stopable-timer.utils";
import { GamePhaseController } from "./game-phase.class"
import { GameTimeController } from "./game-timer.class"

export class GameRoundController {
    private readonly _gameTimeController: GameTimeController
    private readonly _gamePhaseController: GamePhaseController
    private readonly _nextRoundNotifier = new Subject();

    public readonly _rollDiceNotifierOut: Subject<void> = new Subject(); // out
    public readonly _rollDiceByUserNotifierIn: Subject<void> = new Subject(); // in


    constructor() {
        this._gameTimeController = new GameTimeController();
        this._gamePhaseController = new GamePhaseController();
        this.startRoundTimers();
        
    }

    private startRoundTimers() {
        this.startRollTimer().pipe(
          switchMap(() => {
            console.log('roll timer end');
            return this.startRoundTimer()
          }),
        ).subscribe(() => {
          this._nextRoundNotifier.next(true);
          console.log("round end...")
        })
      }
    
      /**
       * @returns sobald der timer abgelaufen oder der nutzer die roll funktion ausgeführt hat
       */
      private startRollTimer() {
        const watch = this._gameTimeController.setAndGetWatchByGamePhase(GAME_PHASE.ROLL);
        return race(
          watch.display$.pipe(
            takeUntil(this._nextRoundNotifier),
            tap(() => {
                this._rollDiceNotifierOut.next();
            })
          ),
          this._rollDiceByUserNotifierIn
        ).pipe(
          takeUntil(this._nextRoundNotifier)
        )
      }
    
      private startRoundTimer() {
        const watch = this._gameTimeController.setAndGetWatchByGamePhase(GAME_PHASE.ROUND)
        return watch.display$.pipe(
          takeUntil(this._nextRoundNotifier),
          tap(() => console.log("ROUND TIMER END")),
        );
      }


} 