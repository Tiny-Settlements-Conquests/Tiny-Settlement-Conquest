import { BehaviorSubject, Observable, Subject, combineLatest, filter, forkJoin, map, merge, race, switchMap, take, takeUntil, tap, zip } from "rxjs";
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
import { GAME_PHASE } from "../models/game-phase.model";
import { GamePhaseController  } from "./game-phase.class";
import { GameTimeController } from "./game-timer.class";
import { GameRoundController } from "./game-round.class";
import { GameStateController } from "./game-state.class";


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
  private readonly _gameRoundController: GameRoundController;
  private readonly _gameTimeController: GameTimeController;
  private readonly _gamePhaseController: GamePhaseController;
  private readonly _gameStateController: GameStateController;
  private readonly _buildingNotifier = new Subject<PathBuilding | Building>();

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
      resourceMultiplier: 1,
      winningPointsMultiplier: 1
    },
  ) {
    this._gameStateController = new GameStateController();
    this._gameTimeController = new GameTimeController({
      maxRollTimer: this.gameConfig.maxRollTimer,
      maxRoundTimer: this.gameConfig.maxRoundTimer
    });
    this._gamePhaseController = new GamePhaseController();
    this._gameRoundController = new GameRoundController(
      this._gameTimeController,
      this._gamePhaseController
    );
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

  private startGame() {
    const defaultOrder = defaultOrderStrategy(this._round);
    
    this._gameRoundController._rollDiceNotifierOut.pipe(
      takeUntil(this._gameStateController.endNotifier)
    ).subscribe(() => {
      this.rollDice();
    })

    this._gameRoundController._nextRoundNotifier.pipe(
      tap(() => this.getTradeManager().cancelAllTrades()),
      takeUntil(this._gameStateController.endNotifier)
    ).subscribe(() => {
      this._diceRoller.resetRoll();
      defaultOrder.nextRound();
    })

    this._gameStateController.pauseNotifier.pipe(
      takeUntil(this._gameStateController.endNotifier)
    ).subscribe(() => {
      this._gameTimeController.watch?.stop();
    })

    this._gameStateController.resumeNotifier.pipe(
      takeUntil(this._gameStateController.endNotifier)
    ).subscribe(() => {
      this._gameTimeController.watch?.start();
    })

  }

  public pause() {
    this._gameStateController.updateGameState(GAME_STATE.PAUSE);
  }

  public resume() {
    this._gameStateController.updateGameState(GAME_STATE.PLAY);
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
      not: this._gameRoundController._updateCurrentTimerNotifier, 
      gameState: this._gameStateController.selectGameState(),
      typ: this._gameRoundController._gamePhaseController.selectGamePhase(),
    }).pipe(
      filter(({gameState}) => gameState === GAME_STATE.PLAY),
      switchMap(() => combineLatest({
        player: this.selectActiveRoundPlayer(),
      }).pipe(take(1))
      ),
      map(() => {
        return this._gameTimeController.watch?.timeoutLeft ?? 0;
      })
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
    return this._buildingNotifier;
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

  public selectGameState(): Observable<GAME_STATE> {
    return this._gameStateController.selectGameState();
  }

  public nextRound() {
    console.log("next ROUND")
    this._gameRoundController._nextRoundNotifier.next(true);
    
  }

  public rollDice() {
    if(this._diceRoller.hasRolledThisRound) throw new Error();
    this._gameRoundController._rollDiceByUserNotifierIn.next();
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
        this._buildingNotifier.next({
          type: BuildingType.CITY,
          graphNode: node,
          owner: player,
          winningPoints: 2 * this.gameConfig.winningPointsMultiplier
        })
      } else if(typ === BuildingType.TOWN) {
        this._buildingBuildManager.buildBuilding(player, BuildingType.TOWN, node);
        player.winningPointsInventory.addToInventory('points', 1)
        this._buildingNotifier.next({
          type: BuildingType.TOWN,
          graphNode: node,
          owner: player,
          winningPoints: 1 * this.gameConfig.winningPointsMultiplier
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
      this._buildingNotifier.next({
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
