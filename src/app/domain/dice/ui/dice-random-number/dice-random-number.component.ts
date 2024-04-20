import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, computed, output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faDiceFive, faDiceFour, faDiceOne, faDiceSix, faDiceThree, faDiceTwo } from '@fortawesome/free-solid-svg-icons';
import { finalize, interval, take } from 'rxjs';
import { rollDice, rollDices } from '../../domain/functions/roll-dice.function';
import { Dices } from '../../domain/models/dice.model';

@Component({
  selector: 'app-dice-random-number',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './dice-random-number.component.html',
  styleUrls: ['./dice-random-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('center', [
      state('centered', style({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '200px'
      })),
      transition('void <=> centered', [
        animate('4s')
      ]),
    ])
  ]
})
export class DiceRandomNumberComponent {

  public readonly diceOneValue = signal(0);
  public readonly diceTwoValue = signal(0);

  public readonly diceOneIcon = computed(() => {
    return this.icons[this.diceOneValue()] as IconDefinition;
  });

  public readonly diceTwoIcon = computed(() => {
    return this.icons[this.diceTwoValue()] as IconDefinition;
  });

  public readonly result = output<Dices>();

  public readonly icons: { [key: number]: IconDefinition } = {
    0: faDiceOne,
    1: faDiceTwo,
    2: faDiceThree,
    3: faDiceFour,
    4: faDiceFive,
    5: faDiceSix
  };

  @Input()
  public set dices(dices: Dices) {
    interval(90).pipe(
      take(20),
      finalize(() => {
        this.diceOneValue.set(dices[0] - 1);
        this.diceTwoValue.set(dices[1] - 1);
        this.result.emit(dices);
      })
    ).subscribe(() => {
      this.diceOneValue.set(rollDice() - 1 );
      this.diceTwoValue.set(rollDice() - 1 );
    })
  }

}
