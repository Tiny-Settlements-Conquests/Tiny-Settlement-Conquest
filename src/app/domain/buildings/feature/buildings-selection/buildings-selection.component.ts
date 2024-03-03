import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleComponent } from '../../../layouts/ui/title/title.component';
import { BlockComponent } from '../../../layouts/ui/block/block.component';

@Component({
  selector: 'app-buildings-selection',
  standalone: true,
  imports: [
    TitleComponent,
    BlockComponent
  ],
  templateUrl: './buildings-selection.component.html',
  styleUrl: './buildings-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingsSelectionComponent { }
