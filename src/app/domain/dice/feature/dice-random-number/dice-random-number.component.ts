import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Output, computed, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faDiceFive, faDiceFour, faDiceOne, faDiceSix, faDiceThree, faDiceTwo } from '@fortawesome/free-solid-svg-icons';
import { finalize, interval, take } from 'rxjs';

@Component({
  selector: 'app-dice-random-number',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './dice-random-number.component.html',
  styleUrl: './dice-random-number.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('center', [
      state('centered', style({
        postion: 'absolute',
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

  public readonly result = output()

  

  public readonly icons: { [key: number]: IconDefinition } = {
    0: faDiceOne,
    1: faDiceTwo,
    2: faDiceThree,
    3: faDiceFour,
    4: faDiceFive,
    5: faDiceSix
  };

  @HostListener('click')
  public roll() {
    const done = interval(90).pipe(
      take(20),
      finalize(() => {
        console.log("done")
      })
    ).subscribe(() => {
      this.diceOneValue.set(Math.floor(Math.random() * 6));
      this.diceTwoValue.set(Math.floor(Math.random() * 6));
    })
  }

}
