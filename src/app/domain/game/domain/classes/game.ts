import { BehaviorSubject, Subject, combineLatest, map, merge, race, share, switchMap, take, takeUntil, tap, timer } from "rxjs";
import { BuildCostManager } from "../../../buildings/domain/classes/build-cost-manager";
import { BuildingBuildManager } from "../../../buildings/domain/classes/building-build-manager";
import { RoadBuildManager } from "../../../buildings/domain/classes/road-build-manager";
import { rollDices } from "../../../dice/domain/functions/roll-dice.function";
import { GraphNode } from "../../../graph/domain/classes/graph-node";
import { ResourceInventory } from "../../../inventory/domain/classes/resource-inventory";
import { Playground } from "../../../playground/domain/classes/playground";
import { Round } from "../../../round/domain/classes/round";
import { defaultOrderStrategy } from "../../../round/domain/strategies/default-round-order.strategy";
import { GameMode } from "../models/game-mode.model";
import { GameDependencies, GameConfig } from "../models/game.model";
import { Building, BuildingType, PathBuilding, PathType } from "../../../buildings/domain/models/building.model";


export class Game {
  public readonly playground: Playground;
  private readonly _round: Round;
  private readonly _roadBuildManager: RoadBuildManager;
  private readonly _buildingBuildManager: BuildingBuildManager;
  private readonly _bank: ResourceInventory;
  private readonly _costManager: BuildCostManager;

  private _mode: GameMode = 'city';

  private readonly rolledDice = new Subject<[number, number]>();
  private hasRolledThisRound = false;
  
  private readonly _buildingSignal = new Subject<PathBuilding | Building>();

  private readonly _state = new BehaviorSubject<'roll' | 'round'>('roll');
  private readonly _nextRoundSignal = new Subject();
  private readonly _pauseSignal = new Subject();
  private readonly _endSignal = new Subject();

  constructor(
    dependencies: GameDependencies,
    private readonly gameConfig: GameConfig = {
      maxCitiesPerPlayer: 5,
      maxRoadsPerPlayer: 15,
      maxRollTimer: 5_000,
      maxRoundTimer: 10_000,
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
    this.startGame();
  }

  private startGame() {
    this.startRoundTimers();
    const defaultOrder = defaultOrderStrategy(this._round);
    
    this._nextRoundSignal.pipe(
      takeUntil(this._endSignal)
    ).subscribe(() => {
      console.log("NEXT ROUND");
      defaultOrder.nextRound();
      this.startRoundTimers();
    })
  
  }

  public pause() {
    this._pauseSignal.next(true);
  }

  private resume() {
  }

  public get roadBuildManager() {
    return this._roadBuildManager;
  }

  public get costManager() {
    return this._costManager;
  }

  public startRoundTimers() {
    this.startRollTimer().pipe(
      takeUntil(this._pauseSignal),
      switchMap(() => {
        console.log('roll timer abgelaufen');
        return this.startRoundTimer()
      }),
      takeUntil(this._pauseSignal),
    ).subscribe(() => {
      this._nextRoundSignal.next(true);
      console.log("runde zu ende...")
    })
  }

  /**
   * @returns sobald der timer abgelaufen oder der nutzer die roll funktion ausgeführt hat
   */
  private startRollTimer() {
    this._state.next('roll');
    return race(
      timer(this.gameConfig.maxRollTimer).pipe(
        takeUntil(this._nextRoundSignal),
        tap(() => {
          this.rollDice();
        })
      ),
      this.rolledDice
    ).pipe(
      takeUntil(this._nextRoundSignal)
    )
  }

  private startRoundTimer() {
    this._state.next('round');
    return race(
      timer(this.gameConfig.maxRoundTimer).pipe(
        takeUntil(this._nextRoundSignal),
      ),
    ).pipe(
      takeUntil(this._nextRoundSignal)
    )
  }

  public selectActiveRoundPlayer() {
    return this._round.selectActivePlayer();
  }

  public selectRound() {
    return this._round.selectRound()
  }

  public selectCurrentTimer() {
    return combineLatest({
      player: this.selectActiveRoundPlayer(),
      typ: this._state,
    }).pipe(
      map(({ typ }) => {
        if (typ === 'roll') {
          return this.gameConfig.maxRollTimer;
        }
        return this.gameConfig.maxRoundTimer;
      })
    )
  }

  public getBuildCosts() {
    return this._costManager.buildingCosts
  }

  public set mode(mode: GameMode ) {
    this._mode = mode;
  }

  public get round() {
    return this._round;
  }

  public selectDice() {
    return this.rolledDice;
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

  public selectPlayersWinningPoints()  {
    return merge(
      ...this._round.players.map((p) => p.winningPointsInventory.selectInventoryUpdate().pipe(
          map((update) => ({...update, player: p }))
      )))
  }

  public selectRolledDice() {
    return this.rolledDice.pipe(
      map((dices) => ({dices, player: this._round.activePlayer}))
    );
  }

  public nextRound() {
    console.log("next ROUND")
    this._nextRoundSignal.next(true);
    
  }

  public rollDice() {
    if(this.hasRolledThisRound) throw new Error();
    //Todo auslagern
    const dices = rollDices();
    this.rolledDice.next(dices);
    const [valueOne, valueTwo] = dices;
    const value = valueOne + valueTwo;
    const foundFields = this.playground.resourceFields.filter(field => field.value === value);

    foundFields.forEach((field) => {
      field.field.polygon.points.forEach((p) => {
        try {
          const owner = this._buildingBuildManager.getOwnerOfBuildingByPoint(p);
          
          const amount = 1 * this.gameConfig.resourceMultiplier; // todo hier schauen welcher typ und dann * resourceMultiplier
          if(this._bank.resources[field.typ] > amount) {
            owner.resourceInventory.addToInventory(field.typ, amount);
            this._bank.removeFromInventory(field.typ, amount);
          }
        } catch (error) {}
      })
    })
    //todo ungut, nicht returnen sondern eher als observable selectable machen
    return dices;
  }

  public tryBuildBuildingOnGraphNode(node: GraphNode) {
    if(this._mode === 'spectate') return;
    const player = this._round.activePlayer;
    if(!player) return;

    try {
      if(this._mode === 'road') {
        this._roadBuildManager.tryBuildRoad(player, node);

      } else if(this._mode === 'city') {
        this._buildingBuildManager.buildBuilding(player, BuildingType.CITY, node);
        player.winningPointsInventory.addToInventory('points', 1)
        this._buildingSignal.next({
          type: BuildingType.CITY,
          graphNode: node,
          owner: player,
          winningPoints: 2
        })
      } else if(this._mode === 'town') {
        this._buildingBuildManager.buildBuilding(player, BuildingType.TOWN, node);
        player.winningPointsInventory.addToInventory('points', 1)
        this._buildingSignal.next({
          type: BuildingType.TOWN,
          graphNode: node,
          owner: player,
          winningPoints: 1
        })
        
      }
      console.log("YYYYY");

    } catch(e) {
      console.log("ERROR",e)
    }
  }

  public tryBuildRoadBetweenGraphNodes(nodeA: GraphNode, nodeB: GraphNode) {
    const player = this._round.activePlayer;
    if(!player) return;
    this._roadBuildManager.tryBuildRoadBetween(player, nodeA, nodeB);
    this._buildingSignal.next({
      type: PathType.ROAD,
      graphNodeA: nodeA,
      graphNodeB: nodeB,
      owner: player
    })

  }

}
