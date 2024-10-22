import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResourceInventoryComponent } from '../../../inventory/feature/resource-inventory/resource-inventory.component';
import { BuildingsSelectionComponent } from '../../../buildings/feature/buildings-selection/buildings-selection.component';

@Component({
  selector: 'app-building-options-inventory',
  standalone: true,
  imports: [
    ResourceInventoryComponent,
    BuildingsSelectionComponent
  ],
  templateUrl: './building-options-inventory.component.html',
  styleUrl: './building-options-inventory.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingOptionsInventoryComponent { }
