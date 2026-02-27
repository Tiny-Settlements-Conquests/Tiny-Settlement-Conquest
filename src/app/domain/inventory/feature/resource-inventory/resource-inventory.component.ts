import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActionCardStackComponent } from '../../../cards/feature/action-card-stack/action-card-stack.component';
import { GameFacade } from '@catan/feature-game';

@Component({
    selector: 'app-resource-inventory',
    imports: [
        ActionCardStackComponent
    ],
    templateUrl: './resource-inventory.component.html',
    styleUrl: './resource-inventory.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceInventoryComponent {
  private readonly _facade = inject(GameFacade);
  
  public readonly inventory = this._facade.inventory;
}
