import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActionCardStackComponent } from '../../../cards/feature/action-card-stack/action-card-stack.component';
import { InventoryRepository } from '../../domain/state/inventory.repository';

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
  private readonly _inventoryRepository = inject(InventoryRepository);
  
  public readonly _inventory = toSignal(
    this._inventoryRepository.selectInventory()
  )

  public get inventory() {
    return this._inventory();
  }

  
}
