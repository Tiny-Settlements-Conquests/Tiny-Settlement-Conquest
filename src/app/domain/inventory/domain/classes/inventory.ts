export class Inventory {

  constructor(private _resources = {
    straw: 0,
    stone: 0,
    wool: 0,
    bricks: 0,
    wood: 0
  }) { }

  public get resources() {
    return this._resources;
  }
  
}
