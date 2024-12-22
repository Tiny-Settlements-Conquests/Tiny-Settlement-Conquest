import { Injectable, inject } from "@angular/core";
import { BankActions } from "./bank.actions";
import { createEffect, ofType } from "@ngneat/effects";
import { tap } from "rxjs";
import { BankRepository } from "./bank.repository";

@Injectable({
    providedIn: 'root'
})
export class BankEffects {
    private readonly repository = inject(BankRepository)
    public readonly updateResourceAmount = createEffect((actions) =>
        actions.pipe(
            ofType(BankActions.updateResourceAmount),
            tap(({resourceType, amount}) => {
                this.repository.updateResourceAmount(resourceType, amount);

            })
        )
    )
}