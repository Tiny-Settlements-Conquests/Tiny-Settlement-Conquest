import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockComponent } from '../../../layouts/ui/block/block.component';
import { ActionCardComponent } from '../../../cards/feature/action-card/action-card.component';
import { ActionCardStackComponent } from '../../../cards/feature/action-card-stack/action-card-stack.component';

@Component({
  selector: 'app-bank',
  standalone: true,
  imports: [
    BlockComponent,
    ActionCardStackComponent
  ],
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankComponent { }
