import { ChangeDetectionStrategy, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { delay, take, tap } from 'rxjs';
import { DiceRandomNumberComponent } from '../dice-random-number/dice-random-number.component';
import { DiceStore } from '../../domain/state/dice.store';
import { GameFacade } from '@catan/feature-game';

@Component({
    selector: 'app-dice-overlay',
    imports: [
        DiceRandomNumberComponent
    ],
    templateUrl: './dice-overlay.component.html',
    styleUrl: './dice-overlay.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiceOverlayComponent { 
  private readonly _diceStore = inject(DiceStore);
  private readonly _facade = inject(GameFacade);
  public readonly hasRolled = signal(false);

  @ViewChild(DiceRandomNumberComponent, {
    static: false
  })
  private readonly diceComponent: DiceRandomNumberComponent | undefined;

  constructor() {
    effect(() => {
      const dices = this._diceStore.dices();
      if (dices !== undefined) {
        this.rollDices(dices);
      }
    });
  }

  public rollDiceRequest(): void {
    this._facade.rollDice();
  }

  private rollDices(dices: [number, number]): void {
    if (this.hasRolled() || !this.diceComponent) return;
    this.hasRolled.set(true);
    this.diceComponent.dices = dices;
    outputToObservable(this.diceComponent.result).pipe(
      take(1),
      delay(1000),
      tap(() => this._diceStore.setIsOverlayOpen(false))
    ).subscribe();
  }
}
