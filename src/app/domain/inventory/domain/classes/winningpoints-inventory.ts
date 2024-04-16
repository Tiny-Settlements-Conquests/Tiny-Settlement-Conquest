import { Inventory } from "./inventory";

type WinningPoints = {
  points: number;
}

export class WinningpointsInventory extends Inventory<WinningPoints> {
  constructor(_initData: WinningPoints = {
    points: 0
  }) {
    super(_initData);
  }
  
  public get points() {
    return this._inventory.value.points;
  }
}
