import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActionCardMode } from '@catan/shared/models';


@Component({
    selector: 'app-action-card',
    imports: [
        FontAwesomeModule
    ],
    templateUrl: './action-card.component.html',
    styleUrl: './action-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionCardComponent { 
  public readonly count = input(0);
  public readonly mode = input<ActionCardMode>('blue');

  @HostBinding('class')
  get modeClass() { return this.mode(); }
}
