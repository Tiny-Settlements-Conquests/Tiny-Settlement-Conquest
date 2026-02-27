import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DiceRandomNumberComponent } from '../../../dice/ui/dice-random-number/dice-random-number.component';
import { DiceAction } from '@catan/shared/models';

@Component({
    selector: 'app-dice-event',
    imports: [
        DiceRandomNumberComponent,
    ],
    templateUrl: './dice-event.component.html',
    styleUrl: './dice-event.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiceEventComponent { 
  public readonly action = input.required<DiceAction>()
}
