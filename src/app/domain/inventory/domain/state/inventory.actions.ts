import { createAction, props } from '@ngneat/effects';
import { Resources, ResourceType } from '../../../resources/domain/models/resources.model';

export class InventoryActions {
    public static readonly setResources = createAction('[inventory Store] set Resources', props<{resources: Resources}>());
    public static readonly updateResourceAmount = createAction('[inventory Store] update resource amount of type', props<{resourceType: ResourceType, amount: number}>());
    public static readonly updateRelativeResourceAmount = createAction('[inventory Store] update relative resource amount of type', props<{resourceType: ResourceType, amount: number}>());
}