import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockComponent } from '../../../layouts/ui/block/block.component';

@Component({
  selector: 'app-action-history',
  standalone: true,
  imports: [
    BlockComponent
  ],
  templateUrl: './action-history.component.html',
  styleUrl: './action-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionHistoryComponent {

}
