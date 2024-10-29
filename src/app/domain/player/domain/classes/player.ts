import { BehaviorSubject, combineLatest, map, tap } from "rxjs";
import { Graph } from "../../../graph/domain/classes/graph";
import { Inventory } from "../../../inventory/domain/classes/inventory";
import { ResourceInventory } from "../../../inventory/domain/classes/resource-inventory";
import { WinningpointsInventory } from "../../../inventory/domain/classes/winningpoints-inventory";
import { RoundPlayer } from "../../../round/domain/models/round-player.model";


export class Player {
  private readonly isActive = new BehaviorSubject(true)
  constructor(
    private readonly _roundPlayer: RoundPlayer,
    private readonly _resourceInventory: ResourceInventory,
    private readonly _winngingPointsInventory: WinningpointsInventory,
    private readonly _buildingGraph: Graph
  ) { }

  public selectChanges() {
    return combineLatest([
      this.isActive,
      this._resourceInventory.selectInventory(),
      this._winngingPointsInventory.selectInventory()
    ]).pipe(
      map(() => this)
    )
  }
  
  public get id() {
    return this._roundPlayer.id;
  }

  public get roundPlayer(): RoundPlayer {
    return this._roundPlayer;
  }

  public get buildingGraph(): Graph {
    return this._buildingGraph;
  }

  public get resourceInventory(): ResourceInventory {
    return this._resourceInventory
  }

  public get winningPointsInventory(): WinningpointsInventory {
    return this._winngingPointsInventory;
  }

  public get color(): string {
    return this._roundPlayer.color;
  }

  public get name() {
    return this._roundPlayer.name
  }

  public get profileUrl() {
    return this._roundPlayer.profileUrl;
  }

  public get resourceCardCount() {
    return this._resourceInventory.amount;
  }
  
  public get researchCardCount() {
    return this._roundPlayer.researchCardCount;
  }

  public get winningPointsAmount() {
    return this._winngingPointsInventory.points;
  }

}
