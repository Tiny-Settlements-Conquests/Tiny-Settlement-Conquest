import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActionCardStackComponent } from '../../../cards/feature/action-card-stack/action-card-stack.component';
import { InventoryStore } from '../../domain/state/inventory.store';

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
  private readonly _inventoryStore = inject(InventoryStore);
  
  public readonly inventory = this._inventoryStore.resources()
}
