import { createAction, props } from "@ngneat/effects";
import { ResourceType } from "../../../resources/domain/models/resources.model";

export class BankActions {
    public static readonly updateResourceAmount = createAction('[gameEventQueue Store] publish event', props<{
        resourceType: ResourceType, 
        amount: number
    }>());
    //todo als interface
}