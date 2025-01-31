import { Injectable, inject } from "@angular/core";
import { createEffect, ofType } from "@ngneat/effects";
import { tap } from "rxjs";
import { InventoryActions } from "./inventory.actions";
import { InventoryRepository } from "./inventory.repository";

@Injectable({
    providedIn: 'root'
})
export class InventoryEffects {
    protected readonly repository = inject(InventoryRepository);

    public setResources = createEffect((actions) =>
        actions.pipe(
            ofType(InventoryActions.setResources),
            tap(({resources}) => {
                this.repository.setResources(resources);
            })
        )
    )

    public updateResourceAmount = createEffect((actions) =>
        actions.pipe(
            ofType(InventoryActions.updateResourceAmount),
            tap(({amount, resourceType}) => {
                this.repository.updateResourceAmount(resourceType, amount);
            })
        )
    )

    public updateRelativeResourceAmount = createEffect((actions) =>
        actions.pipe(
            ofType(InventoryActions.updateRelativeResourceAmount),
            tap(({amount, resourceType}) => {
                this.repository.updateRelativeResourceAmount(resourceType, amount);
            })
        )
    )
    
}