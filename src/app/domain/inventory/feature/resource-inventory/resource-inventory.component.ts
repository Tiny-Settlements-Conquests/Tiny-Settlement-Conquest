import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject, signal } from '@angular/core';
import { BlockComponent } from '../../../layouts/ui/block/block.component';
import { ActionCardComponent } from '../../../cards/feature/action-card/action-card.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { InventoryRepository } from '../../domain/state/inventory.repository';
import { ActionCardSideStackComponent } from '../../../cards/feature/action-card-side-stack/action-card-side-stack.component';
import { ActionCardStackComponent } from '../../../cards/feature/action-card-stack/action-card-stack.component';

@Component({
    selector: 'app-resource-inventory',
    imports: [
        BlockComponent,
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
