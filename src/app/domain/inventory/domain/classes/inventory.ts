import { BehaviorSubject, Subject } from "rxjs";
import { ResourceType } from "../../../resources/models/resource-field.model";

interface ResourcesUpdate {
  type: ResourceType;
  amount: number;
  newAmount: number;
  oldAmount: number;
}

export class Inventory {
  private readonly _resourceUpdate = new Subject<ResourcesUpdate>();

  private readonly _resources = new BehaviorSubject({
    straw: 0,
    stone: 0,
    wool: 0,
    bricks: 0,
    wood: 0
  });

  constructor(_resources = {
    straw: 0,
    stone: 0,
    wool: 0,
    bricks: 0,
    wood: 0
  }) {
    this._resources.next(_resources);
  }

  public get resources() {
    return this._resources.value;
  }

  public addResource(resource: ResourceType, value: number) {
    this._resourceUpdate.next({
      type: resource,
      amount: value,
      newAmount: this.resources[resource] + value,
      oldAmount: this.resources[resource]
    });
    this._resources.next({
      ...this.resources,
      [resource]: this.resources[resource] + value
    });
    
  }

  public removeResource(resource: ResourceType, value: number) {
    this._resourceUpdate.next({
      type: resource,
      amount: value * -1,
      newAmount: this.resources[resource] - value,
      oldAmount: this.resources[resource]
    });
    this._resources.next({
      ...this.resources,
      [resource]: this.resources[resource] - value
    });
  }

  public selectResources() {
    return this._resources;
  }

  public selectResourceUpdate() {
    return this._resourceUpdate;
  }
  
}
