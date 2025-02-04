import { ChangeDetectionStrategy, ChangeDetectorRef, Component, InjectionToken, Input, ViewChild, effect, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { DiceRandomNumberComponent } from '../dice-random-number/dice-random-number.component';
import { DiceRepository } from '../../domain/state/dice.repository';

@Component({
    selector: 'app-dice-overlay',
    imports: [
        DiceRandomNumberComponent
    ],
    templateUrl: './dice-overlay.component.html',
    styleUrl: './dice-overlay.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiceOverlayComponent{ 
  public readonly diceRepository = inject(DiceRepository);
  public readonly hasRolled = signal(false);
  public readonly cd = inject(ChangeDetectorRef)

  @ViewChild(DiceRandomNumberComponent, {
    static: false
  })
  private readonly diceComponent : DiceRandomNumberComponent | undefined;

  public readonly result = new Subject();

  private readonly _dices = signal<[number, number]>([1,1]);

  @Input()
  set dices(v: [number, number]) {
    this._dices.set(v);
  }

  get dices(): [number, number] {
    return this._dices();
  }

  public rollDices() {
    console.log("ROLL");
    if(this.hasRolled() || this.diceComponent === undefined) return;
    console.log("PASS")
    this.hasRolled.set(true);
    this.diceComponent.dices = this.dices;
    this.diceComponent?.result.subscribe(() => {
      this.result.next(this.dices);
    })
  }
}
