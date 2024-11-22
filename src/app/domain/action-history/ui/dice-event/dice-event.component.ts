import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DiceRandomNumberComponent } from '../../../dice/ui/dice-random-number/dice-random-number.component';
import { DiceAction } from '../../domain/models/action.model';

@Component({
  selector: 'app-dice-event',
  standalone: true,
  imports: [
    DiceRandomNumberComponent,
  ],
  templateUrl: './dice-event.component.html',
  styleUrl: './dice-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiceEventComponent { 
  public readonly action = input.required<DiceAction>()
}
