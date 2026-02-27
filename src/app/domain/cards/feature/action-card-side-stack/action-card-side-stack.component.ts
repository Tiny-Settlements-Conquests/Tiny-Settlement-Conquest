import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ActionCardMode } from '@catan/shared/models';
import { ActionCardComponent } from '../action-card/action-card.component';

@Component({
    selector: 'app-action-card-side-stack',
    imports: [
        ActionCardComponent,
        NgStyle
    ],
    templateUrl: './action-card-side-stack.component.html',
    styleUrl: './action-card-side-stack.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionCardSideStackComponent { 
  public readonly count = input(0);
  public readonly mode = input<ActionCardMode>('blue');

  public readonly countArray = computed(() => {
    // - 1 because we have one display card which doesnt count!
    const c = this.count();
    if(c === 0) return [];
    return new Array(c - 1).fill(0);
  });
}
