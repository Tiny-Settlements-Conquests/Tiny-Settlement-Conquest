import { Injectable, inject } from '@angular/core';
import { createEffect, ofType } from '@ngneat/effects';
import { tap } from 'rxjs';
import { ActionHistoryActions } from './action-history.actions';
import { ActionHistoryRepository } from './action-history.repository';

@Injectable({
    providedIn: 'root'
})
export class ActionHistoryEffects {
  private readonly _actionHistoryRepository = inject(ActionHistoryRepository);

  public setRoundTimers$ = createEffect((actions) =>
      actions.pipe(
        ofType(ActionHistoryActions.addAction),
        tap((action) => {
            this._actionHistoryRepository.addAction(action);
        })
      )
    )
    
}