import { StoppableTimer } from "../utils/stopable-timer.utils";
import { GameTimerConfig } from "../models/game-timer.model";
import { GAME_PHASE } from "../models/game-phase.model";
import { switchMap } from "rxjs";


export class GameTimeController {
  private _watch: StoppableTimer | undefined = undefined;

  public get watch(): StoppableTimer | undefined {
    return this._watch;
  }

  public resetWatch(): void {
    this._watch?.end();
    this._watch = undefined;
  }

  constructor(
    private readonly gameConfig: GameTimerConfig = {
      // maxRoundTimer: 1_000_000,
      maxRoundTimer: 15_000,
      maxRollTimer: 5_000,
    }
  ) {}

  public setAndGetWatchByGamePhase(gamePhase: GAME_PHASE): StoppableTimer {
    this.resetWatch();
    switch (gamePhase) {
      case GAME_PHASE.ROLL:
        this._watch = new StoppableTimer(this.gameConfig.maxRollTimer);
        return this._watch;
      case GAME_PHASE.ROUND:
        this._watch = new StoppableTimer(this.gameConfig.maxRoundTimer);
        return this._watch;
      default:
        throw new Error(`GamePhase ${gamePhase} not supported`);
    }
  }
}