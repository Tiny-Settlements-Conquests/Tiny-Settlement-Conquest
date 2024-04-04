import { Observable, Subject, combineLatest, map, merge } from "rxjs";
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
  bank: Inventory,
  roadBuildManager: RoadBuildManager,
  buildingBuildManager: BuildingBuildManager,
  buildCostManager: BuildCostManager
}

export class Game {
  public readonly playground: Playground;
  private readonly _round: Round;
  public readonly roadBuildManager: RoadBuildManager;
  private readonly buildingBuildManager: BuildingBuildManager;
  private readonly _bank: Inventory;
  public readonly _costManager: BuildCostManager;

  private _mode: GameMode = 'city';

  private readonly userInventoryUpdate = new Subject<{player: Player, type: ResourceType, amount: number}>();
  private readonly rolledDice = new Subject<[number, number]>();

  constructor(
    dependencies: GameDependencies,
    private readonly gameConfig: GameConfig = {
      maxCitiesPerPlayer: 5,
      maxRoadsPerPlayer: 15,
      maxRollTimer: 10_000,
      maxRoundTimer: 100_000,
      maxTownsPerPlayer: 5,
      winPoints: 10,
      resourceMultiplier: 1
    },
  ) { 
    this.playground = dependencies.playground;
    this._round = dependencies.round;
    this._bank = dependencies.bank;
    this.buildingBuildManager = dependencies.buildingBuildManager;
    this.roadBuildManager = dependencies.roadBuildManager;
    this._costManager = dependencies.buildCostManager;
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

  public selectBankInventory() {
    return this._bank.selectResources();
  }

  public selectBankInventoryUpdate() {
    return this._bank.selectResourceUpdate();
  }

  public selectUserInventoryUpdate() {
    return merge(
      ...this._round.players.map((p) => p.inventory.selectResourceUpdate().pipe(
          map((update) => ({...update, player: p }))
      )))
  }

  public selectRolledDice() {
    return this.rolledDice;
  }

  public nextRound() {
    this._round.next();
  }

  public rollDice() {
    const dices = rollDices();
    const [valueOne, valueTwo] = dices;
    const value = valueOne + valueTwo;
    const foundFields = this.playground.resourceFields.filter(field => field.value === value);

    foundFields.forEach((field) => {
      field.field.polygon.points.forEach((p) => {
        try {
          const owner = this.buildingBuildManager.getOwnerOfBuildingByPoint(p);
          
          const amount = 1 * this.gameConfig.resourceMultiplier; // todo hier schauen welcher typ und dann * resourceMultiplier
          if(this._bank.resources[field.typ] > amount) {
            this.userInventoryUpdate.next({player: owner, type: field.typ, amount: amount * -1});
            owner.inventory.addResource(field.typ, amount);
            this._bank.removeResource(field.typ, amount);
          }
        } catch (error) {}
      })
    })
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
      this.roadBuildManager.tryBuildRoad(player, node);
    } else if(this._mode === 'city') {
      this.buildingBuildManager.tryBuildBuilding(player, 'city', node);
    } else if(this._mode === 'town') {
      this.buildingBuildManager.tryBuildBuilding(player, 'town', node);
    }
  }

  public tryBuildBuildingOnGraphNode(node: GraphNode) {
    const player = this._round.activePlayer;
    if(!player) return;

    if(this._mode === 'city') {
      this.buildingBuildManager.tryBuildBuilding(player, 'city', node);
    } else if(this._mode === 'town') {
      this.buildingBuildManager.tryBuildBuilding(player, 'town', node);
    }
  }

  public tryBuildRoadBetweenGraphNodes(nodeA: GraphNode, nodeB: GraphNode) {
    const player = this._round.activePlayer;
    if(!player) return;
    this.roadBuildManager.tryBuildRoadBetween(player, nodeA, nodeB);

  }

}
