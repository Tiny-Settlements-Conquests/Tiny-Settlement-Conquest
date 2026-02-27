import { ComponentRef, effect, inject, Injectable, Injector } from '@angular/core';
import { delay, Subject, take, tap } from 'rxjs';
import { EVENT_GATEWAY_TOKEN } from '@catan/core';
import { EventGateway } from '@catan/shared/models';
import { GAME_COMPONENT_REF_TOKEN } from '../../../game/domain/tokens/game-component-ref.token';
import { DiceOverlayComponent } from '../../ui/dice-overlay/dice-overlay.component';
import { Dices } from '@catan/shared/models';
import { DiceStore } from '../state/dice.store';

@Injectable({
  providedIn: 'any'
})
export class DiceSyncService {
  public readonly diceRollStart = new Subject();

  private readonly gateway: EventGateway = inject(EVENT_GATEWAY_TOKEN);
  private readonly _diceStore = inject(DiceStore);
  private readonly _hostRef = inject(GAME_COMPONENT_REF_TOKEN);
  private _diceRef: undefined | ComponentRef<DiceOverlayComponent> = undefined;
  private readonly _injector = inject(Injector);

  constructor() {
    effect(() => {
      const dices = this._diceStore.dices();
      if(dices !== undefined) {
        this.rollDice(dices)
      }
    })

    effect(() => {
      const isOpen = this._diceStore.isOverlayOpen();
      if(isOpen) {
        this.openDiceOverlay();
      }
    })

    this.diceRollStart.pipe(
    ).subscribe(() => {
      this.gateway.rollDice();
    });
  }


  private openDiceOverlay() {
    const component = this._hostRef.createComponent(DiceOverlayComponent, {
      injector: this._injector
    });
    this._diceRef = component;
    // console.log("Opened Overlay", this._diceRef)
    

  }

  private rollDice(dices: Dices) {
    const diceRef = this._diceRef;
    if(!diceRef) return;

    diceRef.instance.dices = dices;
    diceRef.instance.rollDices()
    diceRef.instance.result.pipe(
      take(1),
      delay(1000),
      tap(() => this._diceStore.setIsOverlayOpen(false))
    ).subscribe(() => diceRef.destroy())
  }

}
