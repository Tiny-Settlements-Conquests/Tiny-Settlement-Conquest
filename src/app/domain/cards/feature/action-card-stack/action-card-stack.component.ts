import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ActionCardComponent } from '../action-card/action-card.component';
import { ActionCardMode } from '@catan/shared/models';

@Component({
    selector: 'app-action-card-stack',
    imports: [
        ActionCardComponent
    ],
    templateUrl: './action-card-stack.component.html',
    styleUrl: './action-card-stack.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionCardStackComponent { 
  public readonly count = input(0);
  public readonly mode = input<ActionCardMode>('blue');
}
