import { BehaviorSubject, Observable, Subject, combineLatest, combineLatestAll, filter, interval, map, merge, mergeAll, share, take, takeUntil, tap, timeout, timeoutWith, timer } from "rxjs";
import { BuildingBuildManager } from "../../../buildings/domain/classes/building-build-manager";
import { RoadBuildManager } from "../../../buildings/domain/classes/road-build-manager";
import { GraphBuildingNode } from "../../../buildings/domain/graph/graph-building-node";
import { Inventory } from "../../../inventory/domain/classes/inventory";
import { Playground } from "../../../playground/domain/classes/playground";
import { Point } from "../../../primitives/classes/Point";
import { Round } from "../../../round/domain/classes/round";
import { GameMode } from "../models/game-mode.model";
import { Player } from "../../../player/domain/classes/player";
import { ResourceType } from "../../../resources/models/resource-field.model";
import { BuildCostManager } from "../../../buildings/domain/classes/build-cost-manager";
import { GraphNode } from "../../../graph/domain/classes/graph-node";
import { rollDices } from "../../../dice/domain/functions/roll-dice.function";
import { ResourceInventory } from "../../../inventory/domain/classes/resource-inventory";
import { timeMapper } from "../../../countdown/domain/operators/time-mapper.operator";
import { defaultOrderStrategy } from "../../../round/domain/strategies/default-round-order.strategy";

interface GameConfig {
  resourceMultiplier: number,
  maxTownsPerPlayer: number,
  maxCitiesPerPlayer: number,
  maxRoadsPerPlayer: number,
  winPoints: number,
  maxRoundTimer: number,
  maxRollTimer: number,
}

interface GameDependencies {
  playground: Playground,
  round: Round,
  bank: ResourceInventory,
  roadBuildManager: RoadBuildManager,
  buildingBuildManager: BuildingBuildManager,
  buildCostManager: BuildCostManager
}

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

  private readonly state = new BehaviorSubject<'roll' | 'round'>('roll');

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
  }

  public get roadBuildManager() {
    return this._roadBuildManager;
  }

  public get costManager() {
    return this._costManager;
  }

  public startGame() {
  }

  private startRollTimer() {
    this.state.next('roll');
    this.rollDice();
    // timer(this.gameConfig.maxRollTimer).pipe(
    //   takeUntil(this.rolledDice)
    // ).subscribe(() => {
    //   console.log("IM DONE WITH FUASFG ASFAFSXVCYXVVX")
    //   // timer abgelaufen starte neue runde
    //   this.startRoundTimer();
    // })
  }

  private startRoundTimer() {
    this.state.next('round');
    timer(this.gameConfig.maxRoundTimer).pipe(
      // takeUntil(this.selectActiveRoundPlayer())
    ).subscribe(() => {
      console.log("IM SO DONE WITH YOU")
      // timer abgelaufen starte neue runde
      this.nextRound();
    })
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
      typ: this.state,
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
    return this.rolledDice;
  }

  public nextRound() {
    const defaultOrder = defaultOrderStrategy(this._round);
    defaultOrder.nextRound();
    this.startRollTimer();
    // this.startRoundTimer()
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

  /**
   * @deprecated
   * @param node 
   * @returns 
   */
  public tryBuildOnGraphNode(node: GraphNode) {
    if(this._mode === 'spectate') return;
    const player = this._round.activePlayer;
    if(!player) return;

    if(this._mode === 'road') {
      this._roadBuildManager.tryBuildRoad(player, node);
    } else if(this._mode === 'city') {
      this._buildingBuildManager.tryBuildBuilding(player, 'city', node);
    } else if(this._mode === 'town') {
      this._buildingBuildManager.tryBuildBuilding(player, 'town', node);
    }
  }

  public tryBuildBuildingOnGraphNode(node: GraphNode) {
    const player = this._round.activePlayer;
    if(!player) return;

    if(this._mode === 'city') {
      this._buildingBuildManager.tryBuildBuilding(player, 'city', node);
    } else if(this._mode === 'town') {
      this._buildingBuildManager.tryBuildBuilding(player, 'town', node);
    }
  }

  public tryBuildRoadBetweenGraphNodes(nodeA: GraphNode, nodeB: GraphNode) {
    const player = this._round.activePlayer;
    if(!player) return;
    this._roadBuildManager.tryBuildRoadBetween(player, nodeA, nodeB);

  }

}
