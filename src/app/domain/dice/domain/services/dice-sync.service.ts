import { ComponentRef, inject, Injectable } from '@angular/core';
import { dispatch } from '@ngneat/effects';
import { delay, filter, take, takeUntil, tap } from 'rxjs';
import { GAME_COMPONENT_REF_TOKEN } from '../../../game/domain/tokens/game-component-ref.token';
import { DiceOverlayComponent } from '../../ui/dice-overlay/dice-overlay.component';
import { Dices } from '../models/dice.model';
import { DiceRepository } from '../state/dice.repository';
import { EventQueueActions } from '../../../event-queues/domain/state/event-queue/event-queue.actions';
import { DiceActions } from '../state/dice.actions';

@Injectable({
  providedIn: 'root'
})
export class DiceSyncService {
  private readonly _diceRepository = inject(DiceRepository);
  private readonly _hostRef = inject(GAME_COMPONENT_REF_TOKEN);
  private _diceRef: undefined | ComponentRef<DiceOverlayComponent> = undefined;

  constructor() {
    this.sync();
  }

  private sync(): void {
    this._diceRepository.selectResetDices().subscribe(() => {
      console.log("RESET.", this._diceRef)
      this._diceRef?.destroy();
      // dispatch(DiceActions.updateDiceOverlayOpenState({isOpen: false}))
    })

    this._diceRepository.selectDices().pipe().subscribe((dices) => {
      if(typeof dices === 'undefined') return;
      this.rollDice(dices);
    })

    this._diceRepository.selectIsOpen().pipe(
      filter((isOpen) => isOpen === true)
    ).subscribe(() => {
      console.log("IS OPEN?!?")
      this.openDiceOverlay();
    })

    this._diceRepository.diceRollStart.pipe(
      tap(() => console.log("1424124124124")),
    ).subscribe(() => {
      console.log("Hi")
      dispatch(
        EventQueueActions.publish({
          eventType: 'rollDices',
          data: null
        })
      )
    });
  }

  private openDiceOverlay() {
    const component = this._hostRef.createComponent(DiceOverlayComponent);
    this._diceRef = component;
    console.log("Indw", this._diceRef)
    

  }

  private rollDice(dices: Dices) {
    const diceRef = this._diceRef;
    if(!diceRef) return;

    diceRef.instance.dices = dices;
    diceRef.instance.rollDices()
    diceRef.instance.result.pipe(
      take(1),
      delay(1000)
    ).subscribe(() => diceRef.destroy())
  }

}
