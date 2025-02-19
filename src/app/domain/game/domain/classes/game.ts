import { BehaviorSubject, Observable, Subject, combineLatest, filter, map, merge, race, switchMap, take, takeUntil, tap } from "rxjs";
import { BuildCostManager } from "../../../buildings/domain/classes/build-cost-manager";
import { BuildingBuildManager } from "../../../buildings/domain/classes/building-build-manager";
import { RoadBuildManager } from "../../../buildings/domain/classes/road-build-manager";
import { Building, BuildingType, PathBuilding, PathType } from "../../../buildings/domain/models/building.model";
import { DiceRoller } from "../../../dice/domain/classes/dice-roller";
import { GraphNode } from "../../../graph/domain/classes/graph-node";
import { ResourceInventory } from "../../../inventory/domain/classes/resource-inventory";
import { Playground } from "../../../playground/domain/classes/playground";
import { ResourceDistributor } from "../../../resources/domain/classes/resources/resource-distributor";
import { RobberManager } from "../../../robber/domain/classes/robber-manager";
import { Round } from "../../../round/domain/classes/round";
import { RoundPlayer } from "../../../round/domain/models/round-player.model";
import { defaultOrderStrategy } from "../../../round/domain/strategies/default-round-order.strategy";
import { TradeManager } from "../../../trade/domain/classes/trade-manager";
import { GameConfig, GameDependencies } from "../models/game.model";
import { createStopableTimer, StoppableTimer } from "../utils/stopable-timer.utils";
import { GAME_STATE } from "../models/game-state.model";


export class Game {
  public readonly playground: Playground;
  private readonly _round: Round;
  private readonly _roadBuildManager: RoadBuildManager;
  private readonly _buildingBuildManager: BuildingBuildManager;
  private readonly _bank: ResourceInventory;
  private readonly _costManager: BuildCostManager;
  private readonly _diceRoller: DiceRoller;
  private readonly _resourceDistributor: ResourceDistributor;
  private readonly _robberManager: RobberManager;
  private readonly _tradeManager: TradeManager;

  private readonly _buildingSignal = new Subject<PathBuilding | Building>();

  private readonly _state = new BehaviorSubject<'roll' | 'round' | 'rob'>('roll');
  private readonly _gameState = new BehaviorSubject<GAME_STATE>(GAME_STATE.PLAY);
  private readonly _nextRoundSignal = new Subject();
  private readonly _pauseSignal = new Subject();
  private readonly _resumeSignal = new Subject();
  private readonly _endSignal = new Subject();

  private _watch: StoppableTimer | undefined = undefined;

  constructor(
    dependencies: GameDependencies,
    private readonly gameConfig: GameConfig = {
      maxCitiesPerPlayer: 5,
      maxRoadsPerPlayer: 15,
      maxRollTimer: 5_000,
      // maxRoundTimer: 1_000_000,
      maxRoundTimer: 15_000,
      maxTownsPerPlayer: 5,
      winPoints: 10,
      resourceMultiplier: 1
    },
  ) { 
    this.playground = dependencies.playground;
    this._round = dependencies.round;
    this._bank = dependencies.bank;
    this._buildingBuildManager = dependencies.buildingBuildManager;
    this._roadBuildManager = dependencies.roadBuildManager;
    this._costManager = dependencies.buildCostManager;
    this._diceRoller = dependencies.diceRoller;
    this._resourceDistributor = dependencies.resourceDistributor;
    this._robberManager = dependencies.robberManager;
    this._tradeManager = dependencies.tradeManager;
    this.startGame();
  }

  //TODO timesHandler for the game
  private startGame() {
    this.startRoundTimers();
    const defaultOrder = defaultOrderStrategy(this._round);
    
    this._nextRoundSignal.pipe(
      tap(() => this.getTradeManager().cancelAllTrades()),
      takeUntil(this._endSignal)
    ).subscribe(() => {
      this._diceRoller.resetRoll()
      this.startRoundTimers();
      defaultOrder.nextRound();
    })

    this._endSignal.pipe(
      take(1)
    ).subscribe(() => {
      this._gameState.next(GAME_STATE.END);
    })
    
    this._pauseSignal.pipe(
      takeUntil(this._endSignal)
    ).subscribe(() => {
      this._gameState.next(GAME_STATE.PAUSE);
      this._watch?.stop();
      console.log("STOPPED.")
      console.log(this._watch)
    })

    this._resumeSignal.pipe(
      takeUntil(this._endSignal)
    ).subscribe(() => {
      this._gameState.next(GAME_STATE.PLAY);
      console.log("START", this._watch)
      this._watch?.start();
    })
  }

  public pause() {
    this._pauseSignal.next(true);
  }

  public resume() {
    this._resumeSignal.next(true);
  }

  public get buildingBuildManager(): BuildingBuildManager {
    return this._buildingBuildManager;
  }

  public get roadBuildManager() {
    return this._roadBuildManager;
  }

  public get costManager() {
    return this._costManager;
  }

  private startRoundTimers() {
    this._watch?.end();
    this._watch = undefined;
    this.startRollTimer().pipe(
      switchMap(() => {
        console.log('roll timer end');
        return this.startRoundTimer()
      }),
    ).subscribe(() => {
      this._nextRoundSignal.next(true);
      console.log("round end...")
    })
  }

  /**
   * @returns sobald der timer abgelaufen oder der nutzer die roll funktion ausgeführt hat
   */
  private startRollTimer() {
    const watch = createStopableTimer(this.gameConfig.maxRollTimer);
    this._watch = watch;
    this._state.next('roll');
    return race(
      watch.display$.pipe(
        takeUntil(this._nextRoundSignal),
        tap(() => {
          this.rollDice();
        })
      ),
      this._diceRoller.selectRolledDice()
    ).pipe(
      takeUntil(this._nextRoundSignal)
    )
  }

  private startRoundTimer() {
    const watch = createStopableTimer(this.gameConfig.maxRoundTimer);
    this._watch = watch;
    this._state.next('round');
    return watch.display$.pipe(
      takeUntil(this._nextRoundSignal),
      tap(() => console.log("ROUND TIMER END")),
    );
  }

  public selectActiveRoundPlayer(): Observable<RoundPlayer> {
    return this._round.selectActivePlayer().pipe(
      map((player) => player.roundPlayer)
    );
  }

  public selectRound() {
    return this._round.selectRound()
  }

  public selectCurrentTimer() {
    return combineLatest({
      player: this.selectActiveRoundPlayer(),
      typ: this._state,
      gameState: this._gameState
    }).pipe(
      filter(({gameState}) => gameState === GAME_STATE.PLAY),
      map(() => {
        console.log("TIMER IS ", this._watch?.timeoutLeft ?? 0)
        return this._watch?.timeoutLeft ?? 0;
      })
      // map(({ typ }) => {
      //   if (typ === 'roll') {
      //     return this.gameConfig.maxRollTimer;
      //   }
      //   return this.gameConfig.maxRoundTimer;
      // })
    )
  }

  public getBuildCosts() {
    return this._costManager.buildingCosts
  }

  public get round() {
    return this._round;
  }

  public selectPlayers() {
    return combineLatest(
      this._round.players.map((p) => p.selectChanges())
    )
  }

  public selectBankInventory() {
    return this._bank.selectInventory();
  }

  public selectBankInventoryUpdate() {
    return this._bank.selectInventoryUpdate();
  }

  public selectBuildingUpdate() {
    return this._buildingSignal;
  }

  public selectUserInventoryUpdate() {
    return merge(
      ...this._round.players.map((p) => p.resourceInventory.selectInventoryUpdate().pipe(
          map((update) => ({...update, player: p }))
      )))
  }
  //TODO build a proper return type! and use roundplayer instead of player!
  public selectPlayersWinningPoints()  {
    return merge(
      ...this._round.players.map((p) => p.winningPointsInventory.selectInventoryUpdate().pipe(
          map((update) => ({...update, player: p }))
      )))
  }

  public selectRolledDice() {
    return this._diceRoller.selectRolledDice().pipe(
      map((dices) => ({dices, player: this._round.getActivePlayer()}))
    );
  }

  public selectGameState(): BehaviorSubject<GAME_STATE> {
    return this._gameState;
  }

  public nextRound() {
    console.log("next ROUND")
    this._nextRoundSignal.next(true);
    
  }

  public rollDice() {
    if(this._diceRoller.hasRolledThisRound) throw new Error();
    const rolledDices = this._diceRoller.rollDices();
    this._resourceDistributor.distributeResources(rolledDices.sum);
  }

  public tryBuildBuildingOnGraphNode(node: GraphNode, typ: BuildingType) {
    const player = this._round.getActivePlayer();
    if(!player) return;

    try {
      if(typ === BuildingType.CITY) {
        this._buildingBuildManager.buildBuilding(player, BuildingType.CITY, node);
        player.winningPointsInventory.addToInventory('points', 1)
        this._buildingSignal.next({
          type: BuildingType.CITY,
          graphNode: node,
          owner: player,
          winningPoints: 2
        })
      } else if(typ === BuildingType.TOWN) {
        this._buildingBuildManager.buildBuilding(player, BuildingType.TOWN, node);
        player.winningPointsInventory.addToInventory('points', 1)
        this._buildingSignal.next({
          type: BuildingType.TOWN,
          graphNode: node,
          owner: player,
          winningPoints: 1
        })
        
      }
    } catch(e) {
      console.log("ERROR",e)
    }
  }

  public tryBuildRoadBetweenGraphNodes(nodeA: GraphNode, nodeB: GraphNode) {
    try {
      const player = this._round.getActivePlayer();
      if(!player) return;
      this._roadBuildManager.buildRoadBetween(player, nodeA, nodeB);
      this._buildingSignal.next({
        type: PathType.ROAD,
        graphNodeA: nodeA,
        graphNodeB: nodeB,
        owner: player
      })

    } catch(e) {
      console.error("ERROR",e);
    }

  }

  getRobberManager() {
    return this._robberManager;
    // try {
    //   this._robberManager.playerRobsAtPosition(player,field);

    // } catch(e) {
    //   console.error(e);
    // }
  }

  getTradeManager() {
    return this._tradeManager
  }

}
